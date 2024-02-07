var pic = document.getElementById('pic')
var click = document.getElementById('image')
var editIcn = document.getElementById('pencil')
var editPage = document.getElementById('edit')
var closeBtn = document.getElementById('cancel')
click.addEventListener('click',()=>{
    pic.click()
})

editIcn.addEventListener('click',()=>{
    var user = document.getElementById('user').textContent
    editPage.style.display='flex';
    console.log(user)
    axios.get(`/info/${user}`).then((info)=>{
        console.log(info)
        // document.getElementById('password').value = info.data.password
        document.getElementById('age').value = info.data.age
        document.getElementById('phone').value = info.data.phone
        document.getElementById('bio').value = info.data.bio
        if(info.data.insta != undefined){
            document.getElementById('insta').value = info.data.insta
        }
        if(info.data.facebook != undefined){
            document.getElementById('fb').value = info.data.facebook
        }
        if(info.data.twitter != undefined){
            document.getElementById('twitter').value = info.data.twitter
        }
    }).catch((e)=>{
        console.log(e)
    })
    document.getElementById('age').value = 'bumr'
})
closeBtn.addEventListener('click',()=>{
     editPage.style.display='none'
})

function launch(){
    window.location.href = '/game'
}


//locomotive Nahi use kaeunga bht madarchod cheez hai toh khud se js se useke jaise kuch likhte hai
// var right = document.getElementById('right')

// window.addEventListener('scroll',(dets)=>{
//     console.log(dets)
// })