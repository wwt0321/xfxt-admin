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
    <pre>{{ fields }}</pre>
    <pre>{{ inputs }}</pre>
    <pre>{{ table }}</pre>
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
        if (['Int', 'BigInt'].includes(typeName)) {
          return '0';
        }
        if (['JSON'].includes(typeName)) {
          return "'' // TODO";
        }
        if (['Date'].includes(typeName)) {
          return 'new Date()';
        }
        return "''";
      };

      this.fields = fields
        .map((v) => {
          return v.name + ': ' + initValue((v.type.ofType || {}).name);
        })
        .join('\n');

      console.log(fields);

      this.inputs = fields
        .filter((v) => {
          return !['nodeId', 'id'].includes(v.name);
        })
        .map((v) => {
          const rules = v.type.kind == 'NON_NULL' ? ':rules="[v => !!v]"' : '';
          const typeName = (v.type.ofType || {}).name;
          if (['Int', 'BigInt'].includes(typeName)) {
            return `<q-input label="${v.description}" v-model.number="edata.${v.name}" type="number" ${rules} />`;
          }
          if (['JSON'].includes(typeName)) {
            return `<q-field label="${v.description}" v-model="edata.${v.name}">
              <!-- TODO: JSON -->
            </q-field>`;
          }
          if (['Date'].includes(typeName)) {
            return `<q-input label="${v.description}" v-model="edata.${v.name}" mask="date" :rules="['date']">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="${v.name}Proxy" transition-show="scale" transition-hide="scale" >
                    <q-date minimal v-model="edata.${v.name}" @input="() => $refs.${v.name}Proxy.hide()" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>`;
          }
          if (false) {
            return `<q-select
              label="状态"
              v-model="edata.${v.name}"
              :options="TODO"
              option-value="id"
              option-label="name"
              map-options
              emit-value
            />`;
          }
          return `<q-input label="${v.description}" v-model="edata.${v.name}" ${rules} />`;
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
