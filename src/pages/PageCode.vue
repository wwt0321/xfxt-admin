<template>
  <div class="q-ma-md">
    <q-select :options="filtered" emit-value map-options label="名称" v-model="name" use-input @filter="filterFn">
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            没有匹配的选项
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <q-input v-model="name" label="数据名称" placeholder="请注意，类型的首字母是大写的" />
    <q-btn @click="getCode" label="获取代码" />
    <q-card class="q-my-md">
      <q-card-section>
        <div class="text-h6">graphql query</div>
        <pre>{{ fields }}</pre>
        <pre>{{ querys }}</pre>
      </q-card-section>
    </q-card>
    <q-card class="q-my-md">
      <q-card-section>
        <div class="text-h6">字段与初始值，适用于 edata</div>
        <pre>{{ edata }}</pre>
      </q-card-section>
    </q-card>
    <q-card class="q-my-md">
      <q-card-section>
        <div class="text-h6">表单输入框，适用于 form</div>
        <pre>{{ inputs }}</pre>
      </q-card-section>
    </q-card>
    <q-card class="q-my-md">
      <q-card-section>
        <div class="text-h6">列描述，适用于 table columns</div>
        <pre>{{ table }}</pre>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { MixinRequest } from '../mixins/MixinRequest';

export default {
  mixins: [MixinRequest],
  data() {
    return {
      types: [],
      filtered: [],
      name: '',
      fields: '',
      querys: '',
      inputs: '',
      table: '',
    };
  },
  async mounted() {
    const data = await this.grequest('types');
    const types = data.schema.types.filter(
      (v) =>
        v.kind == 'OBJECT' && !v.name.endsWith('Payload') && !v.name.endsWith('Connection') && !v.name.endsWith('Edge'),
    );
    this.types = types
      .sort((a, b) => {
        return a.name > b.name ? 1 : -1;
      })
      .map((v) => {
        return {
          label: v.name,
          value: v.name,
        };
      });
    console.log(this.types);
  },
  methods: {
    filterFn(val, update) {
      update(() => {
        if (val == '') {
          this.filtered = this.types;
          return;
        }

        this.filtered = this.types.filter((v) => {
          return v.label.includes(val);
        });
        console.log(this.filtered);
      });
    },
    async getCode() {
      const data = await this.grequest('query', {
        name: this.name,
      });

      if (!data.__type) {
        this.fields = '';
        return;
      }

      const fields = data.__type.fields.filter((v) => {
        return v.name != 'nodeId' && (!v.description || !v.description.startsWith('Reads and enables pagination'));
      });

      const initValue = (typeName) => {
        if (['Int', 'BigInt', 'Float', 'BigFloat'].includes(typeName)) {
          return '0';
        }
        if (['JSON'].includes(typeName)) {
          return 'null // TODO';
        }
        if (['Date'].includes(typeName)) {
          return "'DEFAULT_DATE'";
        }
        return "''";
      };

      const lowcaseName = this.name[0].toLowerCase() + this.name.substring(1);
      this.fields = [
        `${lowcaseName}: gql\``,
        `  query($id: UUID!) {`,
        `    ${lowcaseName}(id: $id) {`,
        `      ${fields.map((v) => v.name).join('\n      ')}`,
        '    }',
        '  }',
        '`',
      ].join('\n');

      this.querys = [
        `${lowcaseName}s: gql\``,
        `  query($first: Int, $offset: Int, $condition: ${this.name}Condition, $filter: ${this.name}Filter, $orderBy: [${lowcaseName}sOrder!]) {`,
        `    ${lowcaseName}s (first: $fisrt, offset: $offset, condition: $condition, filter: $filter, orderBy: $orderBy) {`,
        '      nodes {',
        `        ${fields.map((v) => v.name).join('\n        ')}`,
        '      }',
        '    }',
        '  }',
        '`',
      ].join('\n');

      this.edata = fields
        .map((v) => {
          console.log(v);
          return v.name + ': ' + initValue((v.type || {}).name);
        })
        .join(',\n');

      this.inputs = fields
        .filter((v) => {
          return !['nodeId', 'id'].includes(v.name);
        })
        .map((v) => {
          const rules = v.type.kind == 'NON_NULL' ? ':rules="[v => !!v]"' : '';
          const typeName = (v.type || {}).name;
          if (['Int', 'BigInt', 'Float', 'BigFloat'].includes(typeName)) {
            return `<q-input outlined stack-label dense class="q-my-sm" label="${v.description}" v-model.number="edata.${v.name}" type="number" ${rules} />`;
          }
          if (['JSON'].includes(typeName)) {
            return `<q-field outlined stack-label dense class="q-my-sm" label="${v.description}" v-model="edata.${v.name}">
              <!-- TODO: JSON -->
            </q-field>`;
          }
          if (['Date'].includes(typeName)) {
            return `<q-input outlined stack-label dense class="q-my-sm" label="${v.description}" v-model="edata.${v.name}" mask="####-##-##">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="${v.name}Proxy" transition-show="scale" transition-hide="scale" >
                    <q-date minimal v-model="edata.${v.name}" @input="() => $refs.${v.name}Proxy.hide()" mask="YYYY-MM-DD" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>`;
          }
          if (false) {
            return `<q-select
              outlined
              stack-label
              dense
              class="q-my-sm"
              label="状态"
              v-model="edata.${v.name}"
              :options="TODO"
              option-value="id"
              option-label="name"
              map-options
              emit-value
            />`;
          }
          return `<q-input outlined stack-label dense class="q-my-sm" label="${v.description}" v-model="edata.${v.name}" ${rules} />`;
        })
        .join('\n');

      this.table = fields
        .filter((v) => {
          return !['nodeId'].includes(v.name);
        })
        .map((v) => {
          return `{name: '${v.name}', label: '${v.description}', field: '${v.name}', align: 'left'},`;
        })
        .join('\n');
    },
  },
};
</script>
