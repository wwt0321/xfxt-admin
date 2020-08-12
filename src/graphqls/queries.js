import gql from 'nanographql';

export default {
  ticketTypes: gql`
    query {
      dict: dictTicketTypesList {
        id
        name
      }
    }
  `,
  tickets: gql`
    query($typeId: Int!) {
      tickets: ticketsList(condition: { typeId: $typeId }) {
        id
        name
        price
      }
    }
  `,
};
