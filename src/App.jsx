import {useState, useEffect} from 'react'
import {FaPlusCircle} from 'react-icons/fa'
import {VscSave} from 'react-icons/vsc'
import { MdOutlineToggleOff } from "react-icons/md"

export default function App(){
  const [editMode, setEditMode] = useState(true)
  const [editForm, setEditForm] = useState(false)
  const [dinnerItems, setDinnerItems] = useState([])
  const [hiddenID, setHiddenID] = useState('')
  const [submitText, setSubmitText] = useState(<FaPlusCircle />)
  
  function flipSwitch(){
    setEditMode(!editMode)
    if(editMode){
      document.querySelector('.toggle-icon').style.transform = 'rotate(180deg)'
      document.querySelectorAll('.edit-controls').forEach(item=>item.style.display = 'none')
    }else{
      document.querySelector('.toggle-icon').style.transform = 'rotate(0deg)'
      document.querySelectorAll('.edit-controls').forEach(item=>item.style.display = 'block')
      
    }
  }
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
                                  price: formData.get('price'),
                                  sequence: formData.get('sequence')
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
                                                        preDescription: formData.get('preDescription'),
                                                        description: formData.get('description'),
                                                        price: formData.get('price'),
                                                        sequence: formData.get('sequence')
                                                      })
    })
      .then(console.log(`Updated: ${formData.get('name')}`))
      .then(setEditForm(false))
      .then(async()=>await getDinnerItems())
      .catch(err=>console.log(err))
  }

  function updateForm(id,section,name,allergies,preDescription,description,price,sequence){
    setHiddenID(id)
    document.querySelector('#section').value = section
    document.querySelector('#name').value = name
    document.querySelector('#allergies').value = allergies
    document.querySelector('#pre-description').value = preDescription
    document.querySelector('#description').value = description
    document.querySelector('#price').value = price
    document.querySelector('#sequence').value = sequence
    setEditForm(true)
  }

  return(
    <>

    <div class='dinnerMenu'>
    <h1>olea</h1>
    <hr/>
    <div className='appetizersEntrees'>
      <div className='appetizers'>

      {dinnerItems.filter(item=>item.section == 'meats').map(data=>{
        return(
          <div key={data._id} className='item'>
            <span className='name'>{data.name}</span>
            {data.allergies ? <><span className='allergies'> ({data.allergies})</span><br/></> : <br/>}
            {data.preDescription ? <span className='pre-description'>{data.preDescription}; </span> : ''}
            <span className='description'>{data.description}</span>  
            <span className='price'> &nbsp;&nbsp;{data.price}</span><br/>
            <div className='edit-controls'>
              {data.sequence}<br/>
              <i  className='fa-solid fa-trash-can'
                  onClick={()=>deleteDinnerItem(data._id)}></i>
              <i  className='fa-solid fa-pen'
                  onClick={()=>updateForm(data._id,
                                          data.section,
                                          data.name,
                                          data.allergies,
                                          data.preDescription,
                                          data.description,
                                          data.price,
                                          data.sequence)}></i>
            </div>{/* edit-controls */}
          </div>
        )
      })}
    


    {dinnerItems.filter(item=>item.section == 'appetizers').map(data=>{
        return(
          <div key={data._id} className='item'>
            <span className='name'>{data.name}</span>
            {data.allergies ? <><span className='allergies'> ({data.allergies})</span><br/></> : <br/>}
            {data.preDescription ? <span className='pre-description'>{data.preDescription}; </span> : ''}
            <span className='description'>{data.description}</span>  
            <span className='price'> &nbsp;&nbsp;{data.price}</span><br/>
            <div className='edit-controls'>
              {data.sequence}<br/>
              <i  className='fa-solid fa-trash-can'
                  onClick={()=>deleteDinnerItem(data._id)}></i>
              <i  className='fa-solid fa-pen'
                  onClick={()=>updateForm(data._id,
                                          data.section,
                                          data.name,
                                          data.allergies,
                                          data.preDescription,
                                          data.description,
                                          data.price,
                                          data.sequence)}></i>
            </div>{/* edit-controls */}
          </div>
        )
      })}
      </div>{/* appetizers */}

      <div className='entrees'>
      {dinnerItems.filter(item=>item.section == 'entrees').map(data=>{
        return(
          <div key={data._id} className='item'>
            <span className='name'>{data.name}</span>
            {data.allergies ? <><span className='allergies'> ({data.allergies})</span><br/></> : <br/>}
            {data.preDescription ? <span className='pre-description'>{data.preDescription}; </span> : ''}
            <span className='description'>{data.description}</span>  
            <span className='price'> &nbsp;&nbsp;{data.price}</span><br/>
            <div className='edit-controls'>
              {data.sequence}<br/>
              <i  className='fa-solid fa-trash-can'
                  onClick={()=>deleteDinnerItem(data._id)}></i>
              <i  className='fa-solid fa-pen'
                  onClick={()=>updateForm(data._id,
                                          data.section,
                                          data.name,
                                          data.allergies,
                                          data.preDescription,
                                          data.description,
                                          data.price,
                                          data.sequence)}></i>
            </div>{/* edit-controls */}            
          </div>
        )
      })}

      <div className='item'>
        chef's tasting menu six courses 105 / person<br/>
        48-hours notice and reservation required<br/>
        full table participation<br/>
        available tuesday through thursday<br/>
        optional wine pairing available 52 / person<br/>
      </div>
      </div>{/* entrees */}

  </div>{/* appetizersEntrees */}

  <h2 className='sides-heading'>sides</h2>
  <div className='sides'>
  {dinnerItems.filter(item=>item.section == 'sides').map(data=>{
        return(
          <div key={data._id} className='item'>
            <span className='name'>{data.name}</span>
            {data.allergies ? <><span className='allergies'> ({data.allergies})</span><br/></> : <br/>}
            {data.preDescription ? <span className='pre-description'>{data.preDescription}; </span> : ''}
            <span className='description'>{data.description}</span>  
            <span className='price'> &nbsp;&nbsp;{data.price}</span><br/>
            <div className='edit-controls'>
              {data.sequence}<br/>
              <i  className='fa-solid fa-trash-can'
                  onClick={()=>deleteDinnerItem(data._id)}></i>
              <i  className='fa-solid fa-pen'
                  onClick={()=>updateForm(data._id,
                                          data.section,
                                          data.name,
                                          data.allergies,
                                          data.preDescription,
                                          data.description,
                                          data.price,
                                          data.sequence)}></i>
            </div>{/* edit-controls */}
          </div>
        )
      })}

  </div>{/* sides */}
  </div>{/* dinnerMenu */}
 

 <div class='toggle'>Edit Mode <MdOutlineToggleOff className='toggle-icon' onClick={flipSwitch} /> Print Preview </div>
 
 <div className='edit-controls'>
  <form action={editForm?updateDinnerItem:addDinnerItem}>
        <input type='hidden' id='id' name='id' value={hiddenID} />
        <label>
          Section:
          <input id='section' name='section' placeholder='Section' type='text' />
        </label><br/>
        <label>
          Name:
          <input id='name' name='name' placeholder='Name' type='text' />
        </label><br/>
        <label>
          Allergies:
          <input id='allergies' name='allergies' placeholder='Allergies' type='text' />
        </label><br/>
        <label>
        <label>
          Mini-Description:
          <input id='pre-description' name='preDescription' placeholder='Mini-Description (optional)' type='text' />
        </label><br/>
          Main Description:<br/>
          <textarea id='description' 
                    name='description' 
                    placeholder='Description'
                    cols='30'
                    rows='5'></textarea>
          
        </label><br/>
        <label>
          Price:
          <input id='price' name='price' placeholder='Price' type='text' />
        </label><br/>
        <label>
          Sequence:
          <input id='sequence' name='sequence' placeholder='Sequence' type='text' />
        </label><br/>
        <button style={editForm?{background:'blue',color:'white'}:{background:'black',color:'white'}}>
          {editForm?<><VscSave /> Save Changes</> : <><FaPlusCircle /> Add Item</>}
        </button><br/><br/>
      </form>
    </div>{/* edit-controls */}

    </>
  )
}