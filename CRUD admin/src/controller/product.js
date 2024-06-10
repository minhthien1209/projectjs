import Product from "../models/products.js";
import { productValid } from "../validation/product.js";
import axios from 'axios'; // npm install axios
import CryptoJS from 'crypto-js'; // npm install crypto-js
import moment from 'moment'; // npm install moment
import qs from 'qs';
import { config} from '../appInfo/config.js'

// getAll
export const getAll = async (req, res) => {
    try {
        const products = await Product.find();
        if (products.length === 0) {
          return res.status(404).json({
              message: "Khong tim thay sp"
          });
        }
        return res.status(200).json({
          message: "Lay ds sp thanh cong",
          data: products,
        });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
  };

// getDetail
export const getDetail = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({
            message: "Khong tim thay sp"
        });
      }
      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

// create
export const Create = async (req, res) => {
    try {
        const {error} = productValid.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }
        const product = await Product.create(req.body);
        if(!product) {
            return res.status(404).json({
                message: "Khong tao duoc sp"
            });
        }
        return res.status(200).json({
            message: "Tao sp thanh cong",
            data: product,
        }); 
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};

// update
export const Update = async(req, res) => {
    try {
      const {error} = productValid.validate(req.body, {abortEarly: false});
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }
        const product = await Product.findByIdAndUpdate(req.params.id,req.body, {
          new: true,
        });
        if(!product) {
            return res.status(404).json({
                message: "Cap nhat khong thanh cong"
            });
        }
        return res.status(200).json({
            message: "Cap nhat thanh cong",
            data: product,
        });
    } catch (error) {
      return res.status(500).json({
        message: error,
      });
    }
};

//remove
export const Remove = async (req, res) => {
    try {
      const data = await Product.findByIdAndDelete(req.params.id);
      if(!data) {
        return res.status(400).json({
          message: "xoa sp khong thanh cong",
        });
      }
      return res.status(200).json({
        message: "Xoa sp thanh cong",
        data: data
      })
    } catch (error) {
      return res.status(500).json({
        message: error,
      });
    }
};

//payment
export const payment = async(req, res) => {
  const embed_data = {
      redirecturl: "https://zalopay.vn"
  };

  const items = [{}];
  const transID = Math.floor(Math.random() * 1000000);
  const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
      app_user: "user123",
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: 50000,
      description: `Lazada - Payment for the order #${transID}`,
      bank_code: "",
      callback_url: " https://2736-2402-800-6294-13e3-48d6-ef90-1055-9729.ngrok-free.app/callback"
  };

  // appid|app_trans_id|appuser|amount|apptime|embeddata|item
  const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  try {
      const result = await axios.post(config.endpoint, null, { params: order });  
      return res.status(200).json(result.data);
  } catch (error) {
      console.log(error.message);
  }   
};

//callback
export const callback = (req, res) => {
  let result = {};

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    console.log("mac =", mac);


    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
    }
    else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng
      let dataJson = JSON.parse(dataStr, config.key2);
      console.log("update order's status = success where app_trans_id =", dataJson["app_trans_id"]);

      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);
}

//order-status
export const order_status = async(req,res) => {
  const app_trans_id = req.params.app_trans_id;
  let postData = {
      app_id: config.app_id,
      app_trans_id: app_trans_id, // Input your app_trans_id
  }
  
  let data = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1; // appid|app_trans_id|key1
  postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
  
  
  let postConfig = {
      method: 'post',
      url: "	https://sb-openapi.zalopay.vn/v2/query",
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: qs.stringify(postData)
  };
  try {
      const result = await axios(postConfig);
      return res.status(200).json(result.data.message = "Don hang thanh toan thanh cong");
  } catch (error) {
      console.log(error.message)
  }
  
}