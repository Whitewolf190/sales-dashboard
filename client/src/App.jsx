import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import TotalSalesChart from './components/totalsales'
import SalesGrowthChart from './components/salesgrowth'
import NewCustomersChart from './components/newcustomers'
import CombinedCustomerChart from './components/repeatedCustomer'
import CustomerGeography from './components/customerGeography'
import Navbar from './components/Navbar'
import './App.css'

function App() {

  return (
    <>
    <Navbar/>
     <TotalSalesChart/>
     
     <div className='section-1' >
     <SalesGrowthChart/>
     <CombinedCustomerChart/>
     </div>
     <NewCustomersChart/>
     {/* <CustomerGeography/> */}
    </>
  )
}

export default App
