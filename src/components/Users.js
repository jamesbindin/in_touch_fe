import React, { Component } from 'react'
import axios from 'axios'

// the user component is responsible for crud opperations on users. It has methods for api calls
// and is responsible for displaying, updating the data. It displays error and success messages.
export default class Users extends Component {

    constructor(props) {
        super(props)

        this.state = {
            // api call info 
            url:'http://127.0.0.1:8000/api/user',
            headers:{'Authorization':'Bearer 62ac546c-1eb6-477c-8d7c-ad676b6609cf'},

            // stores current users
            users: [],

            // for new user used in post call 
            newUsername: '',
            newFirstname: '',
            newSurname: '',
            newDateOfBirth: '',
            newPhoneNumber: '',
            newEmail: '',

            // success and error message: the text and css class
            messageText: '',
            messageStyleClass: ''
        }

        // this.changeMessageText = this.changeMessageText.bind(this)
    }


    // calls api to display all users when loaded
    componentDidMount(){
        this.getAllUsers()
    }
    

    // method thats reused to retrieve users using api call
    getAllUsers(){
        axios.get(
            this.state.url, {
            headers : this.state.headers
        })
        .then(response => {
            console.log(response);
            this.setState({users:response.data.data})
        })
        .catch(error => {
            console.log(error);
        })
    }


    // response is given to the method and the error or success message is extracted and stored
    // the css class is also determined from the response 
    changeMessageText(response){
        let message = response.data.message
        let messageClass = 'message-card--success'

        if(!response.data.success){
            messageClass = 'message-card--fail'

        if(!response.data.success && typeof message!= 'string'){
            message = message[Object.keys(message)[0]].toString()
        }  
    }

        this.setState({
            messageText: message,
            messageStyleClass: messageClass
        })

    }


    // handles changes made to new user form and changes state
    newChangeHandler = e => {
        this.setState({[e.target.name] : e.target.value})
    }
    

    // handles submission for new user
    newSubmitHandler = e => {
        e.preventDefault()
        axios.post(this.state.url, {
            'Username': this.state.newUsername,
            'Firstname': this.state.newFirstname,
            'Surname': this.state.newSurname,
            'DateOfBirth': this.state.newDateOfBirth,
            'PhoneNumber': this.state.newPhoneNumber,
            'Email': this.state.newEmail
        }, 
        {
            headers: this.state.headers
        })
        .then(response => {
            console.log(response);
            this.changeMessageText(response)
            this.getAllUsers()
        })
        .catch(error => {
            console.log(error);
            this.changeMessageText(error.response)
        })
    }


    // handles changes made to users on the form. the state is changed as this happens
    editChangeHandler = e => {
        // the field name stores the username and fieldname to make unique.
        let splitName = e.target.name.split('_')
        let username = splitName[0];
        let field = splitName[1]

        let tempUsers = this.state.users 
        this.state.users.forEach((element, i ) => {
           if(element.Username == username){
                tempUsers[i][field] = e.target.value
           } 
        })

        this.setState({
            users : tempUsers
        })
    }


    // handles edit user submission calls api using put
    putSubmitHandler = e => {
        e.preventDefault()
        let user = this.state.users.find(element => element.Username == e.target.name)

        axios.put(this.state.url, {
            'Username': user.Username,
            'Firstname': user.Firstname,
            'Surname': user.Surname,
            'DateOfBirth': user.DateOfBirth,
            'PhoneNumber': user.PhoneNumber,
            'Email': user.Email
        }, 
        {
            headers: this.state.headers
        })
        .then(response => {
            console.log(response);
            this.changeMessageText(response)
            this.getAllUsers()
        })
        .catch(error => {
            console.log(error);
            this.changeMessageText(error.response)
        })
    }


    // handles delete form submission. calls the api 
    deleteSubmitHandler = e => {
        e.preventDefault()
        let userName = e.target.name

        axios.delete(`${this.state.url}/${userName}`, 
        {
            headers: this.state.headers
        })
        .then(response => {
            console.log(response);
            this.changeMessageText(response)
            this.getAllUsers()
        })
        .catch(error => {
            console.log(error);
            this.changeMessageText(error.response)
        })
    }


    // render function
    render() {
        // storing state variables
        const {users} = this.state
        const {newUsername, newFirstname, newSurname, newDateOfBirth, newPhoneNumber, newEmail} = this.state 
        const {messageText} = this.state

        return (
            <>

            <div className="user">
            <div className="heading-container">
                <h2 className="heading-secondary">Edit and Remove User</h2>
            </div>
            <div className="user__table">
            {/* itterate over users and display on table for editing and deleting*/}
            {
                users.length ?
                users.map(
                        user => 
                        <div className="user__row" key={user.Username}>
                        <div className="user__cell">
                            <input className="user__input" type="text" name={`${user.Username}_Username`} value={user.Username} onChange={this.editChangeHandler}></input>
                        </div>
                        <div className="user__cell">
                            <input className="user__input" type="text" name={`${user.Username}_Firstname`} value={user.Firstname} onChange={this.editChangeHandler}></input>
                        </div>
                        <div className="user__cell">
                            <input className="user__input" type="text" name={`${user.Username}_Surname`} value={user.Surname} onChange={this.editChangeHandler}></input>    
                        </div>
                        <div className="user__cell">
                            <input className="user__input" type="date" name={`${user.Username}_DateOfBirth`} value={user.DateOfBirth} onChange={this.editChangeHandler}></input>
                        </div>
                        <div className="user__cell">
                            <input className="user__input" type="text" name={`${user.Username}_PhoneNumber`} value={user.PhoneNumber} onChange={this.editChangeHandler}></input>
                        </div>
                        <div className="user__cell">
                            <input className="user__input" type="email" name={`${user.Username}_Email`} value={user.Email} onChange={this.editChangeHandler}></input>
                        </div>

                            <form className="user__cell" onSubmit={this.putSubmitHandler} name={user.Username}>
                                <button class="user__btn user__btn--primary" type="submit">Edit</button>
                            </form>

                            <form ClassName="user__cell" onSubmit={this.deleteSubmitHandler} name={user.Username}>
                                <button class="user__btn user__btn--secondary" type="submit">Remove</button>
                            </form>

                        </div>
                    ) 
                : null
            }
            </div>

            <div className="heading-container">
                <h2 className="heading-secondary">New User</h2>
            </div>

            {/* table for adding new user */}
            <div className="user__table">
                    <div className="user__row">
                        <div className="user__cell">
                            <input className="user__input" type="text" name="newUsername" value={newUsername} placeholder="username" onChange={this.newChangeHandler}></input>
                        </div>
                        <div className="user__cell">
                            <input className="user__input" type="text" name="newFirstname" value={newFirstname} placeholder="firstname" onChange={this.newChangeHandler}></input>
                        </div>
                        <div className="user__cell">
                            <input className="user__input" type="text" name="newSurname" value={newSurname} placeholder="surname" onChange={this.newChangeHandler}></input>
                        </div>
                        <div className="user__cell">
                            <input className="user__input" type="date" name="newDateOfBirth" value={newDateOfBirth} placeholder="date of birth" onChange={this.newChangeHandler}></input>
                        </div>
                        <div className="user__cell">
                            <input className="user__input" type="text" name="newPhoneNumber" value={newPhoneNumber} placeholder="phone number" onChange={this.newChangeHandler}></input>
                        </div>
                        <div className="user__cell">
                            <input className="user__input" type="email" name="newEmail" value={newEmail} placeholder="email" onChange={this.newChangeHandler}></input>
                        </div>
                        <form className="user__cell" onSubmit={this.newSubmitHandler}>
                            <button class="user__btn user__btn--primary" type="submit">Create</button>
                        </form>
                    </div>
            </div>

            {/* message for error or success section */}
                {
                    messageText ? 
                    <div className={`message-card ${this.state.messageStyleClass}`} >
                        <p className="message-card__text">{this.state.messageText}</p>
                    </div>
                    : null
                }
            </div>
            </>
        )
    }
}
