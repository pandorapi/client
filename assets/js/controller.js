var rest = new $.RestClient('http://localhost:24328')
rest.add('connect')
rest.add('docker')
rest.add('projects')

rest.connect.then((data) => {
    new Vue({
        el: '.ip',
        data: {
            ip: data
        }
    })

    rest.release('connect');
})

rest.wait('connect')

rest.docker.read('list').query({
    all: true
}).then((containers) => {
    containers.unshift({text: "Select a image"})
    new Vue({
        el: '#selectContainer',
        data: {
            containers
        },
        methods: {
            "getContainerInfo": (event) => {
                console.log(event)
                var options = event.srcElement;
                for(var key in options){
                    if(options[key].selected){
                        console.log(options[key])
                        // rest.docker.read('inpect').data()
                        break;
                    }
                }
            }
        }
    })
})
