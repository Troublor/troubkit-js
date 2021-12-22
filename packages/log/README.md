# log

## Structured Log Formatter

```typescript
import {structured} from "@troubkit/log";
import * as winston from "winston";
import {format} from "logform";

const logger = winston.createLogger({
    format: winston.format.combine([
        winston.format.label("test"),
        structured({colorize: true}),
    ]),
});
logger.info("test message", {key: "value"});
// [INFO][12-22|17:36:31.767][test] test message                                     key=value 
```
