import { Telegraf } from "telegraf";

export interface Feature {
    bot: Telegraf;
    init(): Promise<void>;
}