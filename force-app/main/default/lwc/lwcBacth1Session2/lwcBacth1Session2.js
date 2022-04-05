/* eslint-disable no-unused-vars */
import { LightningElement, api, track } from 'lwc';

export default class Bacth1Session2 extends LightningElement {

    message = 'Session2';
    age = 30;
    name = 'John';
    isActive = true;
    isDisabled = false;
    isSelected = false;
    // objects
    // arrays
    // array of objects
    // array of arrays
    // do we need to use @track to make the propery reactive
    @track user = {
        age : 30, // key : value => key = age, value : 30
        name : 'John',
        isActive : true,
        isDisabled : false,
        isSelected : false,
        email : 'abc@gmail.com',
        phone : '1234567890',
        address : '123 Main St',
        address2 : {
        }
        // check if there is any address2 property => true
        // user.address2.street
        // let address2 = user.address2 => true => {}
        // address2.street => undefined ( blank ) -> line
    }

    account = {
        name : 'John Doe',
        phone : '1234567890',
        rating : 'Hot',
    }

    contacts = [
        {
            Id: 1,
            Name: 'Amy Taylor',
            Title: 'VP of Engineering',
        },
        {
            Id: 2,
            Name: 'Michael Jones',
            Title: 'VP of Sales',
        },
        {
            Id: 3,
            Name: 'Jennifer Wu',
            Title: 'CEO',
        },
        {
            Id: 4,
            Name: 'Jennifer Wu',
            Title: 'CEO',
        },
    ];

    @api welcomeMessage = 'Welcome to Lightning Web Components';

    tomImage = 'https://th.bing.com/th/id/R.5bd9295db0878e4e9d0c4de94fc29e72?rik=Gh63eM8NOaYqLw';
    jerryImage = 'https://th.bing.com/th/id/R.211ccb260584a283e1f276bd0f7a4aca?rik=PFjT3TUzWUlv6A&riu=http%3a%2f%2f4.bp.blogspot.com%2f-fufrhbAJk7o%2fU0lbp-LzHOI%2fAAAAAAAAbiY%2fITxxVs5twJ4%2fs1600%2f005.png&ehk=%2fB8f8nnv42jlUNPKhEtIateTteZYF0Wa8zyHJ8vn%2fRs%3d&risl=1&pid=ImgRaw&r=0';
    displayTom = false;
    errorImage = 'https://telemitra.com/wp-content/uploads/2019/10/ICON-disaster-recovery-480x480.png';
    error = 'There is some error';

    handleClick(event){
        // eslint-disable-next-line no-alert
        alert('Hello');
        this.user.age = 40;
    }

    @api
    handleChange(param1, param2, paramN){
        // events, composition
    }

}