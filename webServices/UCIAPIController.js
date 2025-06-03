

// import axios from 'axios';
// import EndPoints from './APIEndpoints';
// import Cookies from 'js-cookie';


// // const TENANT_ID = `16bdaab1-b43e-40a7-b070-60bfeb3611cc`
// const TENANT_ID =  "54da67d3-283d-4d4a-929e-6b58d374e82e"
// // Create an Axios instance 
// const axiosInstance = axios.create();

// // Request interceptor to add Authorization and Tenant-ID headers
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = Cookies.get('uci_token'); // Get token from cookies
//     const tenantId = TENANT_ID; // Get tenantId from cookies

//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     if (tenantId) {
//       config.headers['Tenant-ID'] = tenantId;
//     }

//     return config;
//   },
//   (error) => {
//     // Handle request error
//     console.error('Request Error: ', error);
//     return Promise.reject(error);
//   }
// );

// // Response interceptor to handle unauthorized errors (401)
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       window.location.href = `${BASE_URL}/sessionexpired`;
//     }
//     return Promise.reject(error);
//   }
// );
// export const handleApiError = (error) => {
//   const errorMessage =
//     error.response?.data?.errorCode + " " + error.response?.data?.message ||
//     error.message;
//   console.log("Error: " + errorMessage);
//   throw { statusCode: error.response?.status, errorMessage };
// };
// const setCookieWithExpiration = (name, value, expiresDays) => {
//   Cookies.set(name, value, { expires: expiresDays, secure: true, sameSite: 'strict' });
// };
// // Utility function to decode JWT token
// export const decodeToken = (token) => {
//   try {
//     const base64Url = token.split('.')[1];
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split('')
//         .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
//         .join('')
//     );

//     return JSON.parse(jsonPayload);
//   } catch (e) {
//     console.error('Invalid token', e);
//     return null;
//   }
// };

// export const getLastValue = (instanceId, formData) => {
//   const tenantId = TENANT_ID;
//   if (!instanceId) {
//     return Promise.reject('Instance ID is missing');
//   }

//   const url = EndPoints.GET_LAST_VALUE_POST(tenantId);
//   const bodyData = {
//     instanceId,  
//     ...formData, 
//   };

//   return axiosInstance
//     .post(url, bodyData)
//     .then((response) => {
//       console.log('API Response for getLastValue => ', response.data);
//       return response.data;
//     })
//     .catch((error) => {
//       console.error('API Error: ', error);
//       return Promise.reject(error);
//     });
// };



// // Login API
// export const loginApi = async (username, password) => {
//   const tenantId = TENANT_ID
//   try {
//     if (!tenantId) {
//       throw { statusCode: 400, message: "Tenant ID is undefined" };
//     }

//     const loginUrl = EndPoints.LOGIN_API(tenantId);
//     console.log('Login API URL:', loginUrl);

//     const response = await axiosInstance.post(loginUrl, {
//       userName: username,
//       password: password,
//     });

//     if (response?.data?.token) {
//       // Save token as uci_token in cookies
//       setCookieWithExpiration('uci_token', response.data.token, 7);
//       setCookieWithExpiration('tenantId', tenantId, 7);

//       // Fetch and store license details after login
//       await getAllLicense();
//     } else {
//       throw { statusCode: 401, message: "Login failed, invalid credentials." };
//     }

//     return response.data;
//   } catch (error) {
//     console.error('API Error for loginApi => ', error);
//     throw { statusCode: error.response?.status || 500, message: error.message || 'Something went wrong' };
//   }
// };


// // License API with License Type and End Date handling
// export const getAllLicense = () => {
//   const tenantId = TENANT_ID;

//   return axiosInstance
//     .get(EndPoints.Get_All_License(tenantId))
//     .then((response) => {
//       const { licenseType, endDate } = response.data;
//       if (licenseType) {
//         setCookieWithExpiration("licenseType", licenseType, 7);
//       }
//       if (endDate) {
//         setCookieWithExpiration("licenseEndDate", endDate, 7);
//       }
//       return { result: response.data };
//     })
//     .catch(handleApiError);
// };

// // Function to Display License Bar if Condition 012
// export const displayLicenseBar = () => {
//   const licenseType = Cookies.get("licenseType");
//   const licenseEndDate = Cookies.get("licenseEndDate");

//   if (licenseType === "012") {
//     return `License Type: ${licenseType} | Expires on: ${licenseEndDate}`;
//   } else {
//     return null; 
//   }
// };


// //--------------
// export const getAlarmsData = async ({
//   instanceId,
//   limit = 1000
// }) => {
//   try {
//     const tenantId = TENANT_ID;
//     const response = await axiosInstance.get(
//       EndPoints.GET_ALARMS_DATA(
//         tenantId,
//         instanceId,
//         limit
//       )
//     );
//     return response.data;
//   } catch (error) {
//     return handleApiError(error);
//   }
// };

// export const getHistorialData = async ({
//   instanceId,
//   variable,
//   to,
//   from,
//   frequency = 'hour',
//   limit = 1000
// }) => {
//   try {
//     const tenantId = TENANT_ID;
//     const response = await axiosInstance.get(
//       EndPoints.GET_HISTORIAL_DATA(
//         tenantId,
//         instanceId,
//         variable,
//         to,
//         from,
//         frequency,
//         limit
//       )
//     );
//     return response.data;
//   } catch (error) {
//     return handleApiError(error);
//   }
// };

// // ----new api call ---//
// export const getDataValues = ({ AssetName,timezone }) => {
//   const tenantId = TENANT_ID; 
//   const url = EndPoints.GET_LAST_VALUE(tenantId, AssetName,timezone);

//   return axiosInstance
//     .get(url) // Perform the GET request
//     .then(response => {
//       return response.data; // Return the response data
//     })
//     .catch(error => {
//       return handleApiError(error); // Handle any error in case the request fails
//     });
// };




// //---------new reports---------//
// export const getReportCsv = async (assetName, parameters, frequency, from, to, timezone) => {
//   try {
//     const url = EndPoints.GET_REPORTS(
//       TENANT_ID,
//       assetName,
//       parameters,
//       frequency,
//       from,
//       to,
//       timezone
//     );
//     const response = await axiosInstance.get(url, {
//       responseType: 'blob', // assuming it's a CSV file
//     });
//     return response.data;
//   } catch (error) {
//     handleApiError(error);
//     throw error; // optional: rethrow to handle upstream if needed
//   }
// };
// //----------//
// // api.js or any other file
// export function getHisRuntimeDowntime(assetName,from,to,timezone) {
//   const tenantId = TENANT_ID; // Use the correct tenant ID
//   const url = EndPoints.GET_HISRUNTIME_DOWNTIME(tenantId,assetName,from,to,timezone);
  
//   return axiosInstance
//     .get(url)
//     .then((response) => {
//       return response.data; 
//     })
//     .catch(error => {
//       // If an error occurs, handle it using the custom error handler
//       return handleApiError(error); 
//     });
// } 

// //----------// 

// export const getPerformanceIndex = async (AssetName, from, to,timezone) => {
//   try {
//     const url = EndPoints.GET_PERFORMANCEINDEX(TENANT_ID, AssetName, from, to,timezone);
//     const response = await axiosInstance.get(url);
//     return response.data;
//   } catch (error) {
//     handleApiError(error);
//   }
// };


// export const getOverallPerformanceIndex = async (from, to,timezone) => {
//   try {
//     const url = EndPoints.GET_OVERALL_PERFORMANCEINDEX(from, to,timezone,TENANT_ID, );
//     const response = await axiosInstance.get(url);
//     return response.data;
//   } catch (error) {
//     handleApiError(error);
//   }
// };


// export function getHisRuntimeOkkorNotOk(assemblyLine, from, to) {

//   const url = EndPoints.GET_HISRUNTIME_OKAYORNOTOK( assemblyLine, from, to);
  
//   return axiosInstance
//     .get(url)
//     .then((response) => {
//       return response.data; 
//     })
//     .catch(error => {
//       // If an error occurs, handle it using the custom error handler
//       return handleApiError(error); 
//     });
// } 
// Import dependencies
import axios from 'axios';
import EndPoints from './APIEndpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setItem } from '../utils/storage';

// Constant tenant ID (can also be from env)
const TENANT_ID = '54da67d3-283d-4d4a-929e-6b58d374e82e';

// Create Axios instance
const axiosInstance = axios.create();

// Request interceptor: Add headers
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('uci_token');
    const tenantId = await AsyncStorage.getItem('tenantId');

    if (token) {
      config.headers['Authorization'] = `Bearer ${JSON.parse(token)}`;
    }

    if (tenantId) {
      config.headers['Tenant-ID'] = JSON.parse(tenantId);
    }

    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor: Handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized - handle logout or token refresh here');
    }
    return Promise.reject(error);
  }
);

// Utility: Handle API errors
export const handleApiError = (error) => {
  const errorMessage =
    (error.response?.data?.errorCode
      ? error.response.data.errorCode + ' '
      : '') +
    (error.response?.data?.message || error.message);

  console.log('API Error:', errorMessage);
  throw { statusCode: error.response?.status, errorMessage };
};

// Utility: Decode JWT token
export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Invalid token:', e);
    return null;
  }
};

// ========== API FUNCTIONS ========== //

// Login API
export const loginApi = async (username, password) => {
  const tenantId = TENANT_ID;

  try {
    if (!tenantId) {
      throw { statusCode: 400, message: 'Tenant ID is undefined' };
    }

    const loginUrl = EndPoints.LOGIN_API(tenantId);
    console.log('Login API URL:', loginUrl);

    const response = await axiosInstance.post(loginUrl, {
      userName: username,
      password: password,
    });

    if (response?.data?.token) {
      await setItem('uci_token', response.data.token);
      await setItem('tenantId', tenantId);
    } else {
      throw { statusCode: 401, message: 'Login failed, invalid credentials.' };
    }

    return response.data;
  } catch (error) {
    console.error('API Error for loginApi =>', error);
    throw {
      statusCode: error.response?.status || 500,
      message: error.message || 'Something went wrong',
    };
  }
};

// Get Report CSV
export const getReportCsv = async (
  assetName,
  parameters,
  frequency,
  from,
  to,
  timezone
) => {
  try {
    const url = EndPoints.GET_REPORTS(
      TENANT_ID,
      assetName,
      parameters,
      frequency,
      from,
      to,
      timezone
    );

    const response = await axiosInstance.get(url, {
      responseType: 'text',
      headers: {
        Accept: 'text/csv',
      },
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// ✅ ADDED: Historical Runtime Downtime API
export const getHisRuntimeDowntime = async (assetName, from, to, timezone) => {
  try {
    const url = EndPoints.GET_HISRUNTIME_DOWNTIME(
      TENANT_ID,
      assetName,
      from,
      to,
      timezone
    );
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// ✅ Optionally, also add getPerformanceIndex and getOverallPerformanceIndex:

export const getPerformanceIndex = async (AssetName, from, to, timezone) => {
  try {
    const url = EndPoints.GET_PERFORMANCEINDEX(
      TENANT_ID,
      AssetName,
      from,
      to,
      timezone
    );
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getOverallPerformanceIndex = async (from, to, timezone) => {
  try {
    const url = EndPoints.GET_OVERALL_PERFORMANCEINDEX(
      from,
      to,
      timezone,
      TENANT_ID
    );
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getHisRuntimeOkkorNotOk = async (assemblyLine, from, to) => {
  try {
    const url = EndPoints.GET_HISRUNTIME_OKAYORNOTOK(assemblyLine, from, to);
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Export the axios instance in case it's needed elsewhere
export default axiosInstance;
