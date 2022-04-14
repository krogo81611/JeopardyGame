fetch(`https://jservice.io/api/clues`)
    .then(res => res.json())
    .then(data => {
        console.log(data)
    })