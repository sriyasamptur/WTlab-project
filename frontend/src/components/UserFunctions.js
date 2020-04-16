import axios from 'axios'

export const register = newUser => {
    return axios
        .post('users/register', {
            username: newUser.username,
            email: newUser.email,
            password: newUser.password
        })
        .then(response => {
            window.alert("You've successfully signed up. Please log in.")
            localStorage.setItem('usertoken', response.data)
            return response.data
        })
        .catch(err => {
            if(newUser.username === '' || newUser.email === '' || newUser.password === ''){
                window.alert("Please fill all the fields") 
            }else{
                window.alert("username or email is already existed.")
            }
            
        })
}

export const login = user => {
    return axios
        .post('users/login', {
            username: user.username,
            password: user.password
        })
        .then(response => {
            localStorage.setItem('usertoken', response.data)
            return response.data
        })
        .catch(err => {
            console.log(err)
        })
}

export const getProfile = user => {
    return axios
        .get('users/profile', {
        })
        .then(response => {
            console.log(response)
            return response.data
        })
        .catch(err => {
            console.log(err)
        })
}

export const rate = rate => {
    return axios
        .post('/add_rating', {
            title: rate.title,
            rating: rate.rating,
            user: rate.user
        })
}
