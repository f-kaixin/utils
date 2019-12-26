const http = require('http');
const url = require('url');

const express = () => {
    let app = {},
        tasks = [],
        ifNext = false, 
        ifStop = false,
        next = (params) => {
            ifNext = true;
        },
        execTask = (req, res, path, method) => {
            for (let task of tasks) {
                if (
                    task.path === path &&
                    (task.method === 'use' || (method.toLowerCase() === task.method))
                ) {
                    if (ifNext) {
                        ifStop = true;
                        ifNext = false;
                    }
                    task.cb(req, res, next);
                    if (!ifNext && ifStop) {
                        break;
                    }
                }
            }
        };

    ['get', 'post', 'use'].map(method => {
        app[method] = (...rest) => {
            let path, cb;
            if (rest.length === 1) {
                path = '/';
                cb = rest[0];
            } else {
                path = rest[0];
                cb = rest[1];
            }

            tasks.push({
                method,
                path,
                cb
            })
        }
    })

    app.listen = (...args) => {
        http.createServer((req, res) => {
            let {path, query} = url.parse(req.url, true);
            execTask(req, res, path, req.method);

        }).listen(...args)
    }

    return app;
}


// 测试

let app = express();
app.listen(3000, () => {
    console.log('测试express戴莫')
});

app.get('/test1', () => {
    console.log('这是test1');
});

app.get('/test2', (req, res, next) => {
    console.log('这是test2');
    next();
});

app.get('/test2', () => {
    console.log('进入了test2的第二个中间件');
});

app.get('/test2', () => {
    console.log('没有next函数是不会进入到下一个中间件的');
});

app.post('/test3', () => {
    console.log('这是test3');
});

app.use('/test4', () => {
    console.log('这是test4');
});

