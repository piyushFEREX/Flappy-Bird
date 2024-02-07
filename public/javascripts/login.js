var login = document.getElementById('login')
var signup = document.getElementById('signup')
var change = document.querySelectorAll('.change')
var label = document.getElementById('label')
flag = true;
change.forEach((but)=>{
    but.addEventListener('click',()=>{
        if(flag){
            flag = false
            login.style.transform = 'translateX(0%)'
            signup.style.transform = 'translateX(100%)'
        }
        else{
            flag=true
            login.style.transform = 'translateX(-100%)'
            signup.style.transform = 'translateX(0%)'
        }

    })
})

var inp = document.querySelector("#sUsername")

inp.addEventListener('input',()=>{
    var inputTxt = inp.value 
    if(inputTxt.length > 0){
        axios.get(`/username/${inputTxt}`)
    
    .then((status)=>{
        console.log(status)
        if(status.data == false){
            inp.style.outlineColor = 'green'
            label.textContent = 'Username is Available 🙂'
            label.style.backgroundColor = ' green'
        }
        else{
            inp.style.outlineColor = 'red'
            label.textContent = 'Username is Taken 😖'
            label.style.backgroundColor = 'red'
        }
    })
}
})
inp.addEventListener('focus',()=>{
    label.style.display='flex'
})
inp.addEventListener('blur',()=>{
    label.style.display='none'
})

// window.alert(window.innerWidth)