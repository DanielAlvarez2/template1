import {useState, useEffect} from 'react'
import {FaPlusCircle} from 'react-icons/fa'
import {VscSave} from 'react-icons/vsc'
import { MdOutlineToggleOff } from "react-icons/md"
import { FaSquareCaretUp } from "react-icons/fa6"
import { MdClear } from "react-icons/md"

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
      document.querySelector('.dinner-menu').style.height = '14in'
      document.querySelector('.whitespace-controls').style.display = 'flex'
    }else{
      document.querySelector('.toggle-icon').style.transform = 'rotate(0deg)'
      document.querySelectorAll('.edit-controls').forEach(item=>item.style.display = 'block')
      document.querySelector('.dinner-menu').style.height = 'auto'
      document.querySelector('.whitespace-controls').style.display = 'none'
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
  
  const [marginVertical, setMarginVertical] = useState(0)
  const [paddingHorizontal, setPaddingHorizontal] = useState(0)
  
  function setWhitespace(json){
    console.log(json[0].pixels)
    setMarginVertical(json[0].pixels)
    setPaddingHorizontal(json[1].pixels)
  }
  
  const getWhitespace = ()=>{
    fetch('/api/whitespace')
      .then(async(res)=>await res.json())
      .then(async(json)=>await setWhitespace(json))
      .catch(err=>console.log(err))
  }
  useEffect(()=>getDinnerItems(),[])
  useEffect(()=>getWhitespace(),[])

  async function addDinnerItem(formData){
    await fetch('/api/dinner',{ method:'POST',
                                headers:{'Content-Type':'application/json'},
                                body: JSON.stringify({
                                  section: formData.get('section'),
                                  name: formData.get('name'),
                                  allergies: formData.get('allergies'),
                                  preDescription: formData.get('preDescription'),
                                  description: formData.get('description'),
                                  price: formData.get('price'),
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
                                                      })
    })
      .then(console.log(`Updated: ${formData.get('name')}`))
      .then(setEditForm(false))
      .then(async()=>await getDinnerItems())
      .catch(err=>console.log(err))
  }

  function updateForm(id,section,name,allergies,preDescription,description,price){
    setHiddenID(id)
    document.querySelector('#section').value = section
    document.querySelector('#name').value = name
    document.querySelector('#allergies').value = allergies
    document.querySelector('#pre-description').value = preDescription
    document.querySelector('#description').value = description
    document.querySelector('#price').value = price
    setEditForm(true)
    document.querySelector('#dinner-menu-form').scrollIntoView({behavior:'smooth'})
  }

  function increaseVertical(){
    const newVertical = marginVertical + 1
    fetch('/api/whitespace/vertical',{method:'PUT',
                                      headers:{'Content-Type':'application/json'},
                                      body:JSON.stringify({ direction:'vertical',
                                                            pixels:newVertical})
    })
      .then(res=>console.log(res))
      .then(getWhitespace())
      .catch(err=>console.log(err))
  }
  function decreaseVertical(){
    if(marginVertical == 0) return
    const newVertical = marginVertical - 1
    fetch('/api/whitespace/vertical',{method:'PUT',
                                      headers:{'Content-Type':'application/json'},
                                      body:JSON.stringify({ direction:'vertical',
                                                            pixels:newVertical})
    })
      .then(getWhitespace())
      .catch(err=>console.log(err))
  }
  function increaseHorizontal(){
    const newHorizontal = paddingHorizontal + 1
    fetch('/api/whitespace/horizontal',{method:'PUT',
                                        headers:{'Content-Type':'application/json'},
                                        body:JSON.stringify({ direction:'horizontal',
                                                              pixels:newHorizontal
                                        })
    })
      .then(getWhitespace())
      .catch(err=>console.log(err))
  }
  function decreaseHorizontal(){
    if (paddingHorizontal == 0) return
    const newHorizontal = paddingHorizontal - 1
    fetch('/api/whitespace/horizontal',{method:'PUT',
                                        headers:{'Content-Type':'application/json'},
                                        body: JSON.stringify({direction:'horizontal',
                                                              pixels:newHorizontal})
    })
      .then(getWhitespace())
      .catch(err=>console.log(err))
  }
  function clearForm(){
    document.querySelector('#id').value = ''
    document.querySelector('#section').value = 'disabledSelection'
    document.querySelector('#name').value = ''
    document.querySelector('#allergies').value = ''
    document.querySelector('#pre-description').value = ''
    document.querySelector('#description').value = ''
    document.querySelector('#price').value = ''
  }





















  return(
    <>
    <div className='menu-controls no-print'>
      <div className='toggle-mode'>Edit Mode <MdOutlineToggleOff className='toggle-icon' onClick={flipSwitch} /> Print Preview</div> 
      <div className='whitespace-controls'> 
        
        <span className='vertical-controls'>
          <FaSquareCaretUp  className='caret' 
                            onClick={increaseVertical} />
            {marginVertical}
          <FaSquareCaretUp  className='caret' 
                            style={{transform:'rotate(180deg)'}} 
                            onClick={decreaseVertical} />  
        </span>{/* .vertical-controls */}
        
        &nbsp;WHITESPACE&nbsp;  
        
        <span className='horizontal-controls'>
          <FaSquareCaretUp  className='caret' 
                            style={{transform:'rotate(270deg)'}}
                            onClick={decreaseHorizontal} />
            &nbsp;{paddingHorizontal}&nbsp;
          <FaSquareCaretUp  className='caret' 
                            style={{transform:'rotate(90deg)'}} 
                            onClick={increaseHorizontal} /> 
        </span>{/* .horizontal-controls */}

      </div>{/* .whitespace-controls */}
    </div>
    <div className='dinner-menu'>
    <h1>olea</h1>
    <hr/>
    <div className='appetizersEntrees'>
      <div className='appetizers'>
      <div className='meats'>
      {dinnerItems.filter(item=>item.section == 'meats').map(data=>{
        return(
          <div  key={data._id} 
                className='item' 
                style={{marginTop:marginVertical,
                        marginBottom:marginVertical,
                        paddingLeft:paddingHorizontal,
                        paddingRight:paddingHorizontal}}>
            <span className='name'>{data.name}</span>
            {data.name == 'jamón ibérico' ? '' : data.allergies ? <><span className='allergies'> ({data.allergies})</span><br/></> : <br/>}
            
            
            {data.preDescription ? <span className='pre-description'>{data.preDescription}; </span> : ''}
            {data.description ? <span className='description'>{data.description}</span> : '' }
            
            <span className='price'> &nbsp;&nbsp;{data.price}</span><br/>
            <div className='edit-controls'>
              {data.sequence}<br/>
              
              <button className='trash-button'>
                <i  className='fa-solid fa-trash-can'
                    onClick={()=>deleteDinnerItem(data._id)}
                    style={{cursor:'pointer'}}></i>
                <span>Delete</span>
              </button>
              
              <button className='edit-button'>
                <i  className='fa-solid fa-pen'
                    style={{cursor:'pointer'}}
                    onClick={()=>updateForm(data._id,
                                            data.section,
                                            data.name,
                                            data.allergies,
                                            data.preDescription,
                                            data.description,
                                            data.price,
                                            )}></i>
                <span>Edit</span>                
              </button>
            </div>{/* edit-controls */}
          </div>
        )
      })}
    </div>{/* .meats */}


    {dinnerItems.filter(item=>item.section == 'appetizers').map(data=>{
        return(
          <div  key={data._id} 
                className='item'
                style={{marginTop:marginVertical,
                        marginBottom:marginVertical,
                        paddingLeft:paddingHorizontal,
                        paddingRight:paddingHorizontal}}>
            <span className='name'>{data.name}</span>
            {data.allergies ? <><span className='allergies'> ({data.allergies})</span><br/></> : <br/>}
            {data.preDescription ? <span className='pre-description'>{data.preDescription}; </span> : ''}
            <span className='description'>{data.description}</span>  
            <span className='price'> &nbsp;&nbsp;{data.price}</span><br/>
            <div className='edit-controls'>
              {data.sequence}<br/>
              <i  className='fa-solid fa-trash-can'
                  style={{cursor:'pointer'}}
                  onClick={()=>deleteDinnerItem(data._id)}></i>
              <i  className='fa-solid fa-pen'
                  style={{cursor:'pointer'}}
                  onClick={()=>updateForm(data._id,
                                          data.section,
                                          data.name,
                                          data.allergies,
                                          data.preDescription,
                                          data.description,
                                          data.price,
                                          )}></i>
            </div>{/* edit-controls */}
          </div>
        )
      })}
      </div>{/* appetizers */}

      <div className='entrees'>
      {dinnerItems.filter(item=>item.section == 'entrees').map(data=>{
        return(
          <div  key={data._id} 
                className='item'
                style={{marginTop:marginVertical,
                        marginBottom:marginVertical,
                        paddingLeft:paddingHorizontal,
                        paddingRight:paddingHorizontal}}>
            <span className='name'>{data.name}</span>
            {data.allergies ? <><span className='allergies'> ({data.allergies})</span><br/></> : <br/>}
            {data.preDescription ? <span className='pre-description'>{data.preDescription}; </span> : ''}
            <span className='description'>{data.description}</span>  
            <span className='price'> &nbsp;&nbsp;{data.price}</span><br/>
            {data.name == 'cochinillo' ? <div style={{fontStyle:'italic'}}>(please allow 40 minutes cooking time)</div> : ''}
            <div className='edit-controls'>
              {data.sequence}<br/>
              <i  className='fa-solid fa-trash-can'
                  style={{cursor:'pointer'}}
                  onClick={()=>deleteDinnerItem(data._id)}></i>
              <i  className='fa-solid fa-pen'
                  style={{cursor:'pointer'}}
                  onClick={()=>updateForm(data._id,
                                          data.section,
                                          data.name,
                                          data.allergies,
                                          data.preDescription,
                                          data.description,
                                          data.price,
                                          )}></i>
            </div>{/* edit-controls */}            
          </div>
        )
      })}

      <div  className='item chefs-tasting-menu'
            style={{paddingTop:marginVertical,
                    paddingBottom:marginVertical,
                    paddingLeft:paddingHorizontal,
                    paddingRight:paddingHorizontal}}>
        <span className='name'>chef's tasting menu </span> <span style={{fontStyle:'italic'}}>six courses <strong>105</strong> / person<br/>
        <strong>48-hours notice and reservation required</strong></span><br/>
        full table participation<br/>
        available tuesday through thursday<br/>
        <span style={{fontStyle:'italic'}}>optional wine pairing available <strong>52</strong> / person</span><br/>
      </div>
      </div>{/* entrees */}

  </div>{/* appetizersEntrees */}

  <h2 className='sides-heading' 
      style={{paddingLeft:paddingHorizontal,
              position:'relative',
              bottom:'15px'
      }}>
  sides
  </h2>
  <div className='sides'>
  {dinnerItems.filter(item=>item.section == 'sides').map(data=>{
        return(
          <div  key={data._id} 
                className='item'
                style={{marginTop:marginVertical,
                        marginBottom: !((data.section == 'sides' && data.sequence == 1) || 
                                      (data.section == 'sides' && data.sequence == 2)) ? 
                                      marginVertical : '',
                        paddingLeft:paddingHorizontal,
                        paddingRight:paddingHorizontal}}>
            <span className='name'>{data.name}</span>
            {data.allergies ? <><span className='allergies'> ({data.allergies})</span><br/></> : <br/>}
            {data.preDescription ? <span className='pre-description'>{data.preDescription}; </span> : ''}
            <span className='description'>{data.description}</span>  
            <span className='price'> &nbsp;&nbsp;{data.price}</span><br/>
            <div className='edit-controls'>
              {data.sequence}<br/>
              <i  className='fa-solid fa-trash-can'
                  style={{cursor:'pointer'}}
                  onClick={()=>deleteDinnerItem(data._id)}></i>
              <i  className='fa-solid fa-pen'
                  style={{cursor:'pointer'}}
                  onClick={()=>updateForm(data._id,
                                          data.section,
                                          data.name,
                                          data.allergies,
                                          data.preDescription,
                                          data.description,
                                          data.price,
                                          )}></i>
            </div>{/* edit-controls */}
          </div>
        )
      })}

  </div>{/* .sides */}
  <div className='dinner-menu-footer'>
      <div className='chef'>manuel romero, chef</div>
      <div><img src='/QR1.png' width='70px' /></div>
      <div className='legal-info'>
        consumer advisory: consumption of undercooked meat, poultry, eggs, or seafood may increase the risk of food-borne illnesses<br/>
        all menu items are subject to change according to seasonality and availability<br/>
        <strong>
          please alert your server if you have special dietary requirements before ordering: gl (gluten), d (dairy), n (nuts)
        </strong>

      </div>
  </div>{/* dinner-menu-footer */}
  </div>{/* dinner-menu */}
 

 
 <div className='edit-controls'>
  <div id='dinner-menu-form-wrapper'>
  <form action={editForm?updateDinnerItem:addDinnerItem} id='dinner-menu-form'>
      {editForm ? <h2>Edit Item</h2> : <h2>Create New Item</h2>}
        <input type='hidden' id='id' name='id' value={hiddenID} />
        
        <label>
          Section:&nbsp;
          <select id='section' name='section' defaultValue=''>
            <option selected disabled value=''>Section...</option>
            <option value='meats'>Meats</option>
            <option value='appetizers'>Appetizers</option>
            <option value='entrees'>Entrées</option>
            <option value='sides'>Sides</option>
        </select>
        </label><br/>
        
        <label>
          Name:<br/>
          <input id='name' name='name' placeholder='Name' type='text' />
        </label><br/>
        
        <label>
          Allergies:<br/>
          <input id='allergies' name='allergies' placeholder='Allergies' type='text' />
        </label><br/>
        
        
        <label>
          Mini-Description:<br/>
          <input  id='pre-description' 
                  name='preDescription' 
                  placeholder='Mini-Description (optional)' 
                  type='text' />
        </label><br/>

        <label>
          Main Description:<br/>
          <textarea id='description' 
                    name='description' 
                    placeholder='Description'
                    // cols='30'
                    rows='6'></textarea>
          
        </label><br/>
        
        <label>
          Price:<br/>
          <input id='price' name='price' placeholder='Price' type='text' />
        </label><br/>
                
        <div id='buttons-wrapper'>
        <button type='submit' 
                style={editForm ? {background:'blue',color:'white'} : 
                                  {background:'green',color:'white'}}>
          {editForm?
            <div className='button-flexbox'><VscSave /> <span>Save Changes</span></div> : 
            <div className='button-flexbox'><FaPlusCircle /> <span>Add Item</span></div>}
        </button><br/><br/>

        <button id='clear-button' onClick={clearForm}>
          <div className='button-flexbox'>
            <MdClear /> <span>Clear Form</span>
          </div>{/* .button-flexbox */}
        </button>
        </div>{/* #buttons-wrapper */}
      </form>
      </div>{/* dinner-menu-form-wrapper */}
    </div>{/* edit-controls */}

    <footer className='no-print'>&copy;2025 powered by Toggle Software</footer>
    </>
  )
}