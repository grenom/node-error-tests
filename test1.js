const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
let E = new MyEmitter()

async function test1_1 () {
    try {
        //Всё выполнится и не вывалится в .catch до throw в самом конце
        // все события, callback и исключения в промисах не перехватываются (за исключением await)
        test6_noerror()
        asynctest5_noerror()
        asynctest2()
        asynctest2().catch((err) => console.debug(`error in .catch - ${err.message}`))
        E.on('event1', (e) => console.debug(`Event1 receipt!`))
        E.on('event2', function test () {
            throw new Error('Error event 2')
        })
        E.on('event3', () => {throw new Error('Error event 3')})
        asynctest4()
        setTimeout(() => {throw new Error ('Error in callback')}, 1000*5)

        throw new Error ('LAST error by throw in test1_1')
        console.debug('Никогда не выполнится')
    } catch (error) {
        console.debug(`Catch {} error in test1_1 - ${error.message}`)
    }
    
}

async function test1_2 () {
    try {
        test3() //синхронная, перехватится catch
        console.debug('Никогда не выполнится')
    } catch (error) {
        console.debug(`Catch {} error in test1_2 - ${error.message}`)
    }
}

async function test1_3 () {
    try {
        await asynctest2() //aсинхронная c await, перехватится catch
        console.debug('Никогда не выполнится')
    } catch (error) {
        console.debug(`Catch {} error in test1_3 - ${error.message}`)
    }
}

async function asynctest2 () {
    throw new Error ('Error function async test2')
}

function test3 () {
    throw new Error ('Error function test3')
}

async function asynctest4 () {
    return new Promise ((resolve, reject) => {
        setTimeout(() => reject('Error function async test4'), 1000*5)
    })
}

async function asynctest5_noerror () {
    try {
        throw new Error ('Error function asynctest5_noerror')
    } catch (error) {
        console.debug(`Catch {} error in asynctest5_noerror - ${error.message}`)
    }
}

function test6_noerror () {
    try {
        throw new Error ('Error function test6_noerror')
    } catch (error) {
        console.debug(`Catch {} error in test6_noerror - ${error.message}`)
    }
}


process.on('uncaughtException', (err, origin) => {
    console.error(`global exception - ${origin}:${err.message}`)
})

test1_1()
test1_2()
test1_3()
setInterval(() => console.log('Test Interval') , 1000*5)
setTimeout(() => E.emit('event1'), 1000*3)
setTimeout(() => E.emit('event2'), 1000*6)
setTimeout(() => E.emit('event3'), 1000*9)