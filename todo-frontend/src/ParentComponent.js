
import React,{useState, useCallback} from 'react'
import Headline from './Headline'
import { EmployeeData } from './EmployeeData'

const ChildComponent = React.memo(
    ({term,onItemClick}) => {
        console.log('Child Rendering')
        return (
            <div>
                <h1 onClick={onItemClick}>ChildComponent: {term}</h1>
            </div>
        )
    }
)

function ParentComponent() {
    const [data,setData]= useState({"age":12,"counter":0})
    const [term,setTerm] =useState('fruits');
    const [colums,setColums] = useState(["EmpName","EmpAddress","EmpSalary"])
    const [emps, setEmps] = useState([{'name': 'yogesh', 'address':'india', 'salary':40000},{'name': 'sameer', 'address':'pune', 'salary':60000}])
    const onItemClick = useCallback((e) =>{
        console.log("on CLick : ",e.currentTarget)
    },[term])

    const [name,setName] = useState('');
    // const onItemClick = (e) =>{
    //     console.log("on CLick : ",e.currentTarget)
    // }
   console.log('Parent')

   const onClickBtn = (e)=>{
       setData((item)=>{
           return {...item,"counter": data.counter+1}
       })
   }

   const handleChange = (e)=>{
       console.log(e.target.value,e.target.name)
       setName(e.target.value)
   }

   
    return (
        <div>
            {/* <h1>Parent : {data.counter}</h1>
            <ChildComponent
                term={term}
                onItemClick={onItemClick}
            />
            <button onClick={onClickBtn}>INCREMENT</button> */}
            <Headline colums={colums}/>
            {
                emps.map((emp)=>{
                    return <EmployeeData
                                name={emp.name}
                                address={emp.address}
                                salary={emp.salary}
                            />
                })
            }
            <input type="text" value={name} name="name" onChange={handleChange}/>
        </div>
    )
}

export default ParentComponent
