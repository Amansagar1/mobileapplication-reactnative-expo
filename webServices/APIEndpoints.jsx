'use client';

// const getBaseUrl = () => {
//   if (typeof window !== 'undefined') {
//     console.log("Window defined",`${window.location.protocol}//${window.location.host}` );
//     return `${window.location.protocol}//${window.location.host}`;
//   }
//   console.log("Window not defined" );

//   return ''; 
// };

//  const BASE_URL = getBaseUrl();

// const BASE_URL = process.env.NEXT_PUBLIC_PROD_BASE_URL;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;




const EndPoints = {
  //GET API ---------------//

   // Login Api
   LOGIN_API: (tenantId) =>
    BASE_URL + `/uciapi/api/v1/LoginService/Login?tenantId=${tenantId}`,
  
  
  Get_All_License: (tenantId) =>
    BASE_URL + `/mgmtportalapi/api/v1/MgmtPortalApi/GetLicenseInformation?tenantId=${tenantId}`,





  // new api intigration 
  GET_PERFORMANCEINDEX: (tenantId,AssetName,from,to,timezone) => BASE_URL + `/uciapi/api/v1/KpiService/GetPerformanceIndex?AssetName=${AssetName}&from=${from}&to=${to}&timezone=${timezone}&tenantId=${tenantId}`,

  GET_OVERALL_PERFORMANCEINDEX: (from,to,timezone,tenantId) => BASE_URL + `/uciapi/api/v1/KpiService/GetOverallPerformanceIndex?from=${from}&to=${to}&timezone=${timezone}&tenantId=${tenantId}`,

  GET_REPORTS : (tenantId,assetName,parameters,frequency,from,to,timezone) =>  BASE_URL + `/uciapi/api/v1/KpiService/GetReportCsv?tenantId=${tenantId}&assetName=${assetName}&parameters=${parameters}&frequency=${frequency}&from=${from}&to=${to}&timezone=${timezone}`,
  

  
  GET_HISRUNTIME_DOWNTIME: (tenantId,assetName,from,to,timezone) => BASE_URL + `/uciapi/api/v1/KpiService/GetHisRuntimeDowntime?tenantId=${tenantId}&assetName=${assetName}&from=${from}&to=${to}&timezone=${timezone}`,

  
  // GET_ALARMS : () => BASE_URL + `/api/v1/KpiService/GetAlarm?tenantId=${tenantId}&AssetName=${AssetName}&limit=1000`,


  GET_LAST_VALUE: (tenantId,AssetName,timezone) => BASE_URL + `/uciapi/api/v1/KpiService/GetLastValue?tenantId=${tenantId}&AssetName=${AssetName}&timezone=${timezone}`,


  GET_HISRUNTIME_OKAYORNOTOK: (assemblyLine,from,to) => BASE_URL + `/uciapi/api/v1/KpiService/GetHisOkayAndNotOkay?assemblyLine=${assemblyLine}&from=${from}&to=${to}`,

  GET_HISTORIAL_DATA: (tenantId, instanceId, variable, to, from, frequency, limit) =>
    BASE_URL + `dataapi/api/v1/DataApi/GetHistorialData?tenantId=${tenantId}&instanceId=${instanceId}&variable=${variable}&to=${to}&from=${from}&frequency=${frequency}&limit=${limit}`,





};

Object.freeze(EndPoints);

export default EndPoints;
