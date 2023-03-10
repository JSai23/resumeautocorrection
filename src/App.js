import { useState } from 'react'
import axios from "axios";
import logo from './logo.svg';
import './App.css';
import { Form, Button, Input } from 'react-bootstrap';

function App() {
  const [ list, setList ] = useState(["C++", "Python", "Agile"]);
  const [link, setLink] = useState("");
  const [response, setResponse] = useState("");
  const [ description, setDescription ] = useState("")


  const updateLink = e => {
    e.preventDefault()
    const data = e.target.elements
    const link = data.link.value
    setLink(link)
  }

  const updateKeywords = e => {
    e.preventDefault()
    const data = e.target.elements
    const keywords = data.keywords.value
    var nwords = keywords.split(",")

    // if clear is in nwords clear the list
    if (nwords.includes("clear")) {
      setList([])
    }
    else {
      // add nwords to keywords list after removing any duplicates
      nwords = nwords.filter((item) => !list.includes(item))
      setList(list.concat(nwords))
    }
  }

  const updateDescription = e => {
    e.preventDefault()
    const data = e.target.elements
    const description = data.description.value
    console.log(description)
    var nwords = []
    axios({
      method: "POST",
      url:"keyword",
      data: {
        inputinfo:description
      }
    })
    .then((response) => {
      const res = response.data
      //console.log(res)
      nwords = res.map(function(item) {
        return item[0]
      })
      console.log(nwords)
      setList(list.concat(nwords))

    }).catch((error) => {
      console.log(error)
    })

    // api call for new keywords

    // add newords to keywords list after removing any duplicates
    //nwords = nwords.filter((item) => !list.includes(item))
  }

  const api = e => {
    e.preventDefault()
    const data = e.target.elements  
    const bullet = data.BulletPoint.value

    // iterate through the length of list and check if the checkbox is checked
    // if it is checked, add it to the array
    const checked = []
    for (let i = 0; i < list.length; i++) {
      if (data[list[i]].checked) {
        checked.push(list[i])
      }
    }
    console.log(bullet)
    console.log(checked)
    axios({
      method: "POST",
      url:"chatgpt",
      data: {
        bullet: bullet,
        checked: checked
      }
    })
    .then((response) => {
      const res = response.data.choices[0].text
      setResponse(res)
    }).catch((error) => {
      console.log(error)
    })
  }

  const CheckboxComponent = ({ list }) => {
    return (
    <Form onSubmit={api}>
      <Form.Group className="mb-3" controlId="BulletPoint">
        <Form.Label>Bullet from Resume</Form.Label>
        <Form.Control type="text" placeholder="Enter bullet point to be fixed" />
      </Form.Group>
      {list.map((item) => (
        <Form.Group className="mb-3" controlId={item}>
          <Form.Check type="checkbox" label={item} />
        </Form.Group>
      ))}
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
    );
  };

  const ChatGptResponse = ({ response }) => {
    if (response == "") {
      return <div></div>
    }
    else {
      return (
        <div>
          <h3>Response from ChatGPT</h3>
          <p>{response}</p>
        </div>
    )
    }
  }

  return (
    <div>
      <div>
      <h3>Resume Link</h3>
        <Form onSubmit={updateLink}>
          <Form.Group className="mb-3" controlId="link">
            <Form.Label>Link to Resume</Form.Label>
            <Form.Control type="text" placeholder="Enter link to resume" />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        <h3>Description of Job</h3>
        <Form onSubmit={updateDescription}>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description of Job</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Enter description of job" />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        <h3>Keywords List</h3>
        <Form onSubmit={updateKeywords}>
          <Form.Group className="mb-3" controlId="keywords">
            <Form.Label>Comma-Seperate Keywords List</Form.Label>
            <Form.Control as="textarea" type="text" placeholder="Enter a comma seperate list of keywords" />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
      <h3> Resume </h3>
      <div className="App">
        <iframe width="1500" height="600" src={link} ></iframe>
      </div>
      <h3> Query for better alternatives below! </h3>
      {CheckboxComponent({ list })}
      {ChatGptResponse({ response })}
  </div>

  );
}

export default App;