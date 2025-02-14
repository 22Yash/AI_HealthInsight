import React from 'react'
import image1 from "../assets/upload.png"
import { Link } from 'react-router-dom'


function HomePage() {
  return (
    <>
    <div id="home" className='w-full h-screen'>
        <div id="header" className=' flex flex-col justify-center items-center gap-[20px]'>
            <h1 className='text-[40px] font-bold text-orange-400 pt-[50px] '>Health Insight</h1>
            <p className='text-[30px] font-bold'>Analyze Medical Reports</p>
            <p className='text-[20px] w-[600px] text-center'>The tool to analyze medical reports, empowering you to make informed decisions about your health journey.</p>
        </div>
        <div id="input" className='flex justify-center gap-[50px] mt-[50px]'>
        <Link to='/uploads'>
            <div id="first" className='w-[320px] p-[10px] rounded-3xl shadow-black shadow-lg h-[320px] bg-[#E3F2FD] flex flex-col gap-[10px] justify-center items-center'>
                <img src={image1} alt="" className='w-[180px] p-[10px] '/>
                <p className='text-[18px] w-[220px] text-center'>Scan Medial Report to get the results</p>

               <h1 className='font-bold text-[30px]' >Upload Report </h1>
                

            </div>
            </Link>
            <div id="first" className='w-[250px] h-[250px] bg-amber-200'>

            </div>
        </div>
    </div>
    
    </>
  )
}

export default HomePage
