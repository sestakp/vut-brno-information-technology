import { PayloadAction } from "@reduxjs/toolkit";
import Message from "../Message";

export default interface NotificationAction extends PayloadAction<Message>{
    type: string,
    payload: Message,
}