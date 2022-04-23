import React from 'react';
class Quote extends React.Component{
    constructor(props){
        super(props); 
        this.state = { 
            quote: '',
            author: '',
            index: 0
        }
    }
    getQuotes = (e) =>{
        this.setState({
            index: Math.floor((Math.random() * 225) + 0)
        })
        fetch('https://api.myjson.com/bins/qnf8j')
        .then(response => response.json())
        .then(data => {        
            this.setState({
                quote: data.quotes[this.state.index].quote,
                author: data.quotes[this.state.index].author,
            })
        }).catch(error => console.error(error)); 
    }
    render(){
        return(
            <div>
                <button onClick={this.getQuotes}>change quote</button>
                <div>hola como vas</div>
            </div>
        )
    }
}

export default Quote;