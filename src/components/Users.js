import Axios from 'axios'
import React, { Component } from 'react'
import axios from 'axios'

export default class Users extends Component {
    constructor(props) {
        super(props)

        this.state = {
            url:'http://127.0.0.1:8000/api/user',
            headers:{'Authorization':'Bearer 62ac546c-1eb6-477c-8d7c-ad676b6609cf'},

            users: [],

            newUsername: '',
            newFirstname: '',
            newSurname: '',
            newDateOfBirth: '',
            newPhoneNumber: '',
            newEmail: '',

            messageText: '',
            messageStyleClass: ''
        }

        this.changeMessageText = this.changeMessageText.bind(this)
    }


    componentDidMount(){
        this.getAllUsers()
    }
    

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


    changeMessageText(response){
        let message = response.data.message
        let messageClass = 'msg-success'

        if(!response.data.success && typeof message != 'string'){
            message = message[Object.keys(message)[0]].toString()
            messageClass = 'msg-fail'
        }  

        this.setState({
            messageText: message,
            messageStyleClass: messageClass
        })

    }

    newChangeHandler = e => {
        this.setState({[e.target.name] : e.target.value})
    }
    

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


    editChangeHandler = e => {
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


    render() {
        const {users} = this.state
        const {newUsername, newFirstname, newSurname, newDateOfBirth, newPhoneNumber, newEmail} = this.state 
        const {messageText} = this.state
        return (
            <>
            <div className="user">
            {
                users.length ?
                users.map(
                        user => 
                        <div className="user__row" key={user.Username}>
                            <input className="user__cell" type="text" name={`${user.Username}_Username`} value={user.Username} onChange={this.editChangeHandler}></input>
                            <input className="user__cell" type="text" name={`${user.Username}_Firstname`} value={user.Firstname} onChange={this.editChangeHandler}></input>
                            <input className="user__cell" type="text" name={`${user.Username}_Surname`} value={user.Surname} onChange={this.editChangeHandler}></input>    
                            <input className="user__cell" type="text" name={`${user.Username}_DateOfBirth`} value={user.DateOfBirth} onChange={this.editChangeHandler}></input>
                            <input className="user__cell" type="text" name={`${user.Username}_PhoneNumber`} value={user.PhoneNumber} onChange={this.editChangeHandler}></input>
                            <input className="user__cell" type="text" name={`${user.Username}_Email`} value={user.Email} onChange={this.editChangeHandler}></input>

                            <form className="user__cell" onSubmit={this.putSubmitHandler} name={user.Username}>
                                <button class="user__btn" type="submit">Confirm Changes</button>
                            </form>

                            <form ClassName="user__cell" onSubmit={this.deleteSubmitHandler} name={user.Username}>
                                <button class="user__btn" type="submit">Delete</button>
                            </form>

                        </div>
                    ) 
                : null
            }
                    <div className="user__row">
                        <input className="user__cell" type="text" name="newUsername" value={newUsername} onChange={this.newChangeHandler}></input>
                        <input className="user__cell" type="text" name="newFirstname" value={newFirstname} onChange={this.newChangeHandler}></input>
                        <input className="user__cell" type="text" name="newSurname" value={newSurname} onChange={this.newChangeHandler}></input>
                        <input className="user__cell" type="text" name="newDateOfBirth" value={newDateOfBirth} onChange={this.newChangeHandler}></input>
                        <input className="user__cell" type="text" name="newPhoneNumber" value={newPhoneNumber} onChange={this.newChangeHandler}></input>
                        <input className="user__cell" type="text" name="newEmail" value={newEmail} onChange={this.newChangeHandler}></input>
                        <form className="user__cell" onSubmit={this.newSubmitHandler}>
                            <button class="user__btn" type="submit">Submit</button>
                        </form>
                    </div>
                {
                    messageText ? 
                    <div>
                        <p>{this.state.messageText}</p>
                    </div>
                    : null
                }
                </div>
            </>
        )
    }
}
