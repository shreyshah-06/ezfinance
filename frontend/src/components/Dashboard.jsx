import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axiosInstance from '../helper/axios';
import SideBar from './sidebar';
import Chart from 'react-apexcharts';

export default function Dashboard() {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [chartOptions, setChartOptions] = useState({
    series: [0, 0, 0],
    options: {
      chart: {
        type: 'donut',
      },
      labels: ['Sales', 'Expenses', 'Profit'],
      colors: ['#36A2EB', '#FF6384', '#4CAF50'],
    },
  });

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const currentMonthFirstDay = new Date(Date.UTC(currentYear, currentMonth - 1, 1, 0, 0, 0));
        const currentMonthLastDay = new Date(Date.UTC(currentYear, currentMonth, 0, 23, 59, 59));
        const fromDate = currentMonthFirstDay.toISOString();
        const toDate = currentMonthLastDay.toISOString();

        const response = await axiosInstance.post("/audit/getall", {}, {
          params: { fromDate: fromDate, toDate: toDate },
        });

        setTotalExpenses(response.data.totalExpenses);
        setTotalInvoices(response.data.totalInvoices);
        setChartOptions(prevState => ({
          ...prevState,
          series: [response.data.totalInvoices, response.data.totalExpenses, (response.data.totalInvoices - response.data.totalExpenses)],
        }));
      } catch (error) {
        console.log(error);
      }
    };

    fetchSalesData();
  }, []);

  return (
    <>
      <section style={{ minHeight: '100vh', background: "linear-gradient(90deg, rgba(122,135,113,1) 0%, rgba(118,136,91,1) 29%, rgba(98,114,84,1) 53%, rgba(118,136,91,1) 75%, rgba(122,135,113,1) 100%)" }}>
        <Navbar />
        <div className='row m-0 h-100'>
          <SideBar />
          <div className='col-md-10 mt-4'>
            <div className='row justify-content-around '>
              <div className='col-2 m-2' style={{ borderRadius: '0.7rem', height: '15vh', backgroundColor: '#DDDDDD', opacity: '0.95' }}>
                <div className='d-flex fw-bold justify-content-center pt-1'>Sales (this Month)</div>
                <div className='pt-3 d-flex justify-content-center' style={{ fontSize: '1.1rem', fontWeight: '600' }}>₹ {totalInvoices.toFixed(2)}</div>
              </div>
              <div className='col-2 m-2' style={{ borderRadius: '0.7rem', height: '15vh', backgroundColor: '#DDDDDD', opacity: '0.95' }}>
                <div className='d-flex fw-bold justify-content-center pt-1'>Profit (this Month)</div>
                <div className='pt-3 d-flex justify-content-center' style={{ fontSize: '1.1rem', fontWeight: '600' }}>₹{(totalInvoices - totalExpenses).toFixed(2)}</div>
              </div>
              <div className='col-3 m-2' style={{ borderRadius: '0.7rem', height: '15vh', backgroundColor: '#DDDDDD', opacity: '0.95' }}>
                <div className='d-flex fw-bold justify-content-center pt-1'>Expenses (this Month)</div>
                <div className='pt-3 d-flex justify-content-center' style={{ fontSize: '1.1rem', fontWeight: '600' }}>₹{totalExpenses.toFixed(2)}</div>
              </div>
            </div>
            <div className='mt-5 px-2 d-flex align-items-center justify-content-center'>
              <Chart  width='500px' options={chartOptions.options} series={chartOptions.series} type="donut" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
