const contentContainer = document.getElementById('content-container')
const LoginForm = document.getElementById('login-form')
const searchForm = document.getElementById('search-form')
const baseEndpoint = "http://localhost:8000/api"
if (LoginForm) {
    LoginForm.addEventListener('submit', handleLogin)
}
if (searchForm) {
    searchForm.addEventListener('submit', handlesearch)
}

function handleLogin(event) {
    console.log(event)
    event.preventDefault()
    const loginEndpoint = `${baseEndpoint}/token/`
    let loginFormData = new FormData(LoginForm)
    let loginObjectData = Object.fromEntries(loginFormData)
    let bodyStr = JSON.stringify(loginObjectData)
    const options = {
        "method": "POST",
        headers: {
            "content-Type": "application/json"
        },
        body: bodyStr
    }
    fetch(loginEndpoint, options)  // Promise
    .then(response=>{
        console.log(response)
        return response.json()
    })
    .then(authData => {
        handleAuthData(authData, getProductlist)
    })
    .catch(err=>{
        console.log('err', err)
    })
}

function handlesearch(event) {
    event.preventDefault()
    let formData = new FormData(searchForm)
    let data = Object.fromEntries(formData)
    let searchParams = new URLSearchParams(data)
    const endpoint = `${baseEndpoint}/search/?${searchParams}`
    const headers = {
        "content-Type": "application/json"
    }
    const authToken = localStorage.getItem('access') 
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`
    }
    const options = {
        "method": "GET",
        headers: headers
    }
    fetch(endpoint, options)  // Promise
    .then(response=>{
        console.log(response)
        return response.json()
    })
    .then(data => {
        writeToContainer(data)
    })
    .catch(err=>{
        console.log('err', err)
    })
}

function handleAuthData(authData, callback){
    localStorage.setItem('access', authData.access)
    localStorage.setItem('refresh', authData.refresh)
    if (callback) {
        callback()
    }
}

function writeToContainer(data) {
    if (contentContainer) {
        contentContainer.innerHTML = "<pre>" + JSON.stringify(data, null, 4) + "</pre>"
    }
}

function getFetchOptions(method, body){
    return {
        method: method === null ? "GET" : method, 
        headers:{
            "content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('access')}`
        
        },
        body: body ? body : null
    }
}

function isTokenNotValid(josnData){
    if(josnData.code && josnData.code === "token_not_valid"){
        // run arefresh token fetch
        alert("pllease login again")
        return false
    }
    return true
}

function getProductlist(){
    const endpoint = `${baseEndpoint}/products/`
    const options = getFetchOptions()
    fetch(endpoint, options)
    .then(response=> {
        console.log(response)
        return response.json()
    })
    .then(data=> {
        const validData =  isTokenNotValid(data)
        if (validData){
            writeToContainer(data)
        }
    })
}


const searchClient = algoliasearch('91SFRZFNM7', '403952e3f3f75ec8d2b98e49569369fb');

const search = instantsearch({
    indexName: 'cfe_Product',
    searchClient,
});

search.addWidgets([
    instantsearch.widgets.searchBox({
    container: '#searchbox',
    }),

    instantsearch.widgets.clearRefinements({
        container: "#clear-user-refinements"
    }),


    instantsearch.widgets.refinementList({
        container: "#user-list",
        attribute: 'user'
    }),

    instantsearch.widgets.hits({
    container: '#hits',
    templates: {
        item: `
            <div>
                <div> {{#helpers.highlight}}  { "attribute": "title"} 
                {{/helpers.highlight}}</div>
                <div> {{#helpers.highlight}}  { "attribute": "body"} 
                {{/helpers.highlight}}</div>

                <p>{{ user }}</p><p>{{ price }}

            </div>`
    }
    })
]);

search.start();
