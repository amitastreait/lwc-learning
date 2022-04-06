/* eslint-disable no-alert */
import { LightningElement } from 'lwc';

export default class LwcBatch1Session3 extends LightningElement {

    message = 'Hello World';
    name;
    somevar = [];
    toDos = [
        {
            Id : 1,
            description : 'Learn Lightning Web Components',
            priority : 'High',
            completed : false,
        },
        {
            Id : 2,
            description : 'Learn Integration',
            priority : 'High',
            completed : false,
        }
    ]

    get options(){
        return [
            { label : 'High', value : 'High' },
            { label : 'Low', value : 'Low' },
            { label : 'Meduim', value : '3' },
        ]
    }

    handleClick(event){

        // data- ~= dataset
        console.log(event.currentTarget.dataset.id);
        console.log(event.currentTarget.dataset.recordId);
        // dataset.recordNameAcc
        console.log(this.welcomeMessage); // undefined
        console.log(event.target);
        console.log(event.target.name);
        console.log(event.target.title);
        this.message = event.target.label+ ' Clicked !';

        let message2 = 'Simple Message';
        console.log(message2);

        this.toDos.unshift({
            Id : 3,
            description : 'Learn DevOps',
            priority : 'High',
        });

        this.toDos = [
            ...this.toDos, // spread operator
            {
                Id : 3,
                description : 'Learn SFMC',
                priority : 'High',
            }
        ];

        /*
            this.doDos:forEach(function(item){
                this.somevar.push({
                    label : item.description,
                    value : item.Id,
                });
            });
            let arr = [];
            let arr1 =[];
            let arr3 = [...arr, ...arr1, '', ''];
            this.doDos:forEach(function(item){
                this.somevar = [ ...this.somevar, { label : item.description, value : item.Id }];
            });
            let obj = { name: 'John', age: 30, city: 'New York' };
            let user = { ...obj, email: 'amitsingh@gmail.com' };
            javascript.info
            console.log(this.somevar); // print the vlaues
            // for each item in this.toDos in html it will not print the values

        */

    }

    handleChange(event){
        console.log('handleChange');

        console.log(event.currentTarget.dataset.id); // string
        console.log(typeof event.currentTarget.dataset.id) // string
    }

    handleInputChange(event){
        console.log('handleInputChange');
        console.log(event.target.value);
    }

    handleSubmit = (event) => {
        event.preventDefault();
        console.log('handleSubmit');
        console.log(this.name);
    }

    handleNameChange = (event) => {
        console.log('handleNameChange');
        console.log(event.target.value);
        this.name = event.target.value;
    }

    handlePaid = (event) => {
        console.log('handlePaid');
        console.log(event.target.checked); // false/true
    }
}