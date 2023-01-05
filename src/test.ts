import "reflect-metadata" // this shim is required

import { Log, initLog } from "@perp/common/build/lib/loggers"
import { Container } from "typedi"

import { Arbitrageur } from "./arbitrageur/Arbitrageur"

initLog()

const { USDMClient } = require('binance');

export async function main(): Promise<void> {
    process.env["STAGE"] = "production"
    process.env["NETWORK"] = "optimism"

    // crash fast on uncaught errors
    const exitUncaughtError = async (err: any): Promise<void> => {
        const log = Log.getLogger("main")
        try {
            await log.jerror({
                event: "UncaughtException",
                params: {
                    err,
                },
            })
        } catch (e: any) {
            console.error(`exitUncaughtError error: ${e.toString()}`)
        }
        process.exit(1)
    }
    process.on("uncaughtException", err => exitUncaughtError(err))
    process.on("unhandledRejection", reason => exitUncaughtError(reason))

    // const arbitrageur = Container.get(Arbitrageur)
    // await arbitrageur.setup()
    // await arbitrageur.start()
    await test()
}

async function test():Promise<void> {
    console.log('test')
    const API_KEY = 'xxx';
    const API_SECRET = 'yyy';

    const client = new USDMClient({
        api_key: API_KEY,
        api_secret: API_SECRET,
    });

    client
        .getBalance()
        .then((result:any) => {
            console.log('getBalance result: ', result);
        })
        .catch((err:any) => {
            console.error('getBalance error: ', err);
        });

    client
    .get24hrChangeStatististics()
    .then((result:any) => {
        console.log('get24hrChangeStatististics inverse futures result: ', result);
    })
    .catch((err:any) => {
        console.error('get24hrChangeStatististics inverse futures error: ', err);
    });
}    
const isInLambda = !!process.env.LAMBDA_RUNTIME_DIR
if (require.main === module && !isInLambda) {
    main()
}
