export interface ClickSendMessage {
  body: string;
  from: string;
  to: string;
  date: string;  // or timestamp, based on actual API
  // other fields if needed
}

interface ClickSendInboundResponse {
  data: {
    data: ClickSendMessage[];
  };
}
