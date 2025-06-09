import {useState, useEffect} from 'react'
import {FaPlusCircle} from 'react-icons/fa'
import {VscSave} from 'react-icons/vsc'

export default function App(){
  const [editForm, setEditForm] = useState(false)
  const [dinnerItems, setDinnerItems] = useState([])
  const [hiddenID, setHiddenID] = useState('')
  const [submitText, setSubmitText] = useState(<FaPlusCircle />)
  const getDinnerItems = ()=>{
    fetch('/api/dinner')
      .then(res=>res.json())
      .then(json=>setDinnerItems(json))
      .catch(err=>console.log(err))
  }
  const deleteDinnerItem = async(id)=>{
    await fetch(`/api/dinner/${id}`, {method:'DELETE'})
      .then(console.log(`Deleted from Database`))
      .then(async()=>await getDinnerItems())
      .catch(err=>console.log(err))
  }
  useEffect(()=>getDinnerItems(),[])
  async function addDinnerItem(formData){
    await fetch('/api/dinner',{ method:'POST',
                                headers:{'Content-Type':'application/json'},
                                body: JSON.stringify({
                                  section: formData.get('section'),
                                  name: formData.get('name'),
                                  allergies: formData.get('allergies'),
                                  description: formData.get('description'),
                                  price: formData.get('price')
                                })
    })
      .then(console.log('Added to Database'))
      .then(async ()=> await getDinnerItems())
      .catch(err=>console.log(err))
  }
  async function updateDinnerItem(formData){
    await fetch(`/api/dinner/${formData.get('id')}`,{ method:'PUT',
                                                      headers: {'Content-Type':'application/json'},
                                                      body: JSON.stringify({
                                                        section: formData.get('section'),
                                                        name: formData.get('name'),
                                                        allergies: formData.get('allergies'),
                                                        description: formData.get('description'),
                                                        price: formData.get('price')
                                                      })
    })
      .then(console.log(`Updated: ${formData.get('name')}`))
      .then(setEditForm(false))
      .then(async()=>await getDinnerItems())
      .catch(err=>console.log(err))
  }

  function updateForm(id,section,name,allergies,description,price){
    setHiddenID(id)
    document.querySelector('#section').value = section
    document.querySelector('#name').value = name
    document.querySelector('#allergies').value = allergies
    document.querySelector('#description').value = description
    document.querySelector('#price').value = price
    setEditForm(true)
  }

  return(
    <>
      <form action={editForm?updateDinnerItem:addDinnerItem}>
        <input type='hidden' id='id' name='id' value={hiddenID} />
        <label>
          Section:
          <input id='section' name='section' placeholder='Section' type='text' />
        </label>
        <label>
          Name:
          <input id='name' name='name' placeholder='Name' type='text' />
        </label>
        <label>
          Allergies:
          <input id='allergies' name='allergies' placeholder='allergies' type='text' />
        </label>
        <label>
          Description:
          <input id='description' name='description' placeholder='Description' type='text' />
        </label>
        <label>
          Price:
          <input id='price' name='price' placeholder='Price' type='text' />
        </label>
        <button style={editForm?{background:'blue'}:{background:'black'}}>
          {editForm?<><VscSave /> Save Changes</> : <><FaPlusCircle /> Add Item</>}
        </button>
      </form>

      {dinnerItems.map(data=>{
        return(
          <div key={data._id}>
            {data.section}
            {data.name}
            {data.allergies}
            {data.description}
            {data.price}
            <i  className='fa-solid fa-trash-can'
                onClick={()=>deleteDinnerItem(data._id)}></i>
            <i  className='fa-solid fa-pen'
                onClick={()=>updateForm(data._id,data.section,data.name,data.allergies,data.description,data.price)}></i>
          </div>
        )
      })}
    </>
  )
}