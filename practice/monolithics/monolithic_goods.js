const mysql = require("mysql2");
const conn = {
  host: "localhost",
  user: "root",
  password: "aaaa4321",
  database: "monolithic",
};

/**
 * 상품 관리의 각 기능별로 분기
 */
exports.onRequest = function (res, method, pathname, params, cb) {
  switch (method) {
    case "POST":
      return register(method, pathname, params, (response) => {
        process.nextTick(cb, res, response);
      });
    case "GET":
      return inquiry(method, pathname, params, (response) => {
        process.nextTick(cb, res, response);
      });
    case "DELETE":
      return unregister(method, pathname, params, (response) => {
        process.nextTick(cb, res, response);
      });
    default:
      return process.nextTick(cb, res, null);
  }
};

/**
 * 상품 등록 기능
 * @param method    메서드
 * @param pathname  URI
 * @param params    입력 파라미터
 * @param cb        콜백
 */
function register(method, pathname, params, cb) {
  var response = {
    key: params.key,
    errorcode: 0,
    errormessage: "success",
  };

  if (
    params.name == null ||
    params.category == null ||
    params.price == null ||
    params.description == null
  ) {
    response.errorcode = 1;
    response.errormessage = "Invalid Parameters";
    cb(response);
  } else {
    var connection = mysql.createConnection(conn);
    connection.connect();
    connection.query(
      "insert into goods(name, category, price, description) values(? ,? ,? ,?)",
      [params.name, params.category, params.price, params.description],
      (error, results, fields) => {
        if (error) {
          response.errorcode = 1;
          response.errormessage = error;
        }
        cb(response);
      }
    );
    connection.end();
  }
}

/**
 * 상품 조회 기능
 * @param method    메서드
 * @param pathname  URI
 * @param params    입력 파라미터
 * @param cb        콜백
 */
function inquiry(method, pathname, params, cb) {
  var response = {
    key: params.key,
    errorcode: 0,
    errormessage: "success",
  };

  console.log(" [ inquiry ] ====>>> ", params);

  var connection = mysql.createConnection(conn);
  connection.connect();
  connection.query("select * from  goods", (error, results, fields) => {
    if (error || results.length == 0) {
      response.errorcode = 1;
      response.errormessage = error ? error : "no data";
    } else {
      response.results = results;
    }

    console.log(" response ===>>> ", response);

    cb(response);
  });
  connection.end();
}

/**
 * 상품 삭제 기능
 * @param method    메서드
 * @param pathname  URI
 * @param params    입력 파라미터
 * @param cb        콜백
 */
function unregister(method, pathname, params, cb) {
  var response = {
    key: params.key,
    errorcode: 0,
    errormessage: "success",
  };

  if (params.id == null) {
    response.errorcode = 1;
    response.errormessage = "Invalid Parameters";
    cb(response);
  } else {
    var connection = mysql.createConnection(conn);
    connection.connect();
    connection.query(
      "delete from goods where id = ?",
      [params.id],
      (error, results, fields) => {
        if (error) {
          response.errorcode = 1;
          response.errormessage = error;
        }
        cb(response);
      }
    );
    connection.end();
  }
}
