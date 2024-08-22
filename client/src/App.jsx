
import TotalSalesChart from './components/totalsales'
import SalesGrowthChart from './components/salesgrowth'
import NewCustomersChart from './components/newcustomers'
import CombinedCustomerChart from './components/repeatedCustomer'

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
