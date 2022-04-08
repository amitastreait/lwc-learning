import { LightningElement } from 'lwc';

const COMPLETE_CLASS = 'slds-p-aroung_small complete';
export default class ToDoList extends LightningElement {

    description;
    priority;
    lastId = 2;
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
            { label : 'Meduim', value : 'Meduim' },
            { label : 'Urgent', value : 'Urgent' },
        ];
    }

    handleDescriptionChange = (event) => {
        this.description = event.target.value;
    }
    handlePicklistChange = (event) => {
        this.priority = event.detail.value;
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let cssClass = '';
        if( this.priority === 'Low'){
            cssClass = 'low';
        }else if(this.priority === 'Meduim'){
            cssClass = 'medium';
        }else if(this.priority === 'High'){
            cssClass = 'high';
        }
        this.toDos = [
            ...this.toDos,
            {
                Id : ++this.lastId,
                description : this.description,
                priority : this.priority,
                completed : false,
                cssClass : cssClass
            }
        ]
    }

    handleComplete = (event) => {
        event.preventDefault();
        const id = event.target.dataset.id;
        //console.log(id);
        this.toDos.forEach( item => {
            console.log(item.Id);
            let itemId = item.Id;
            /*console.log(typeof itemId);
            console.log(typeof id);*/
            if(itemId === Number(id)){
                console.log(item);
                item.completed = !item.completed;
                item.COMPLETE_CLASS = item.completed ? COMPLETE_CLASS : ' slds-p-aroung_small ';
            }
        });
        this.toDos = [...this.toDos];
        //console.log(this.toDos);
    }
}