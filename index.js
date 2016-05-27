var mysql=require("mysql");
var async=require("async");
module.exports = function (container) {

    var tasks = [];


    tasks.push({
        name: "mysqlQuery",

        def: function (instacne,config,query) {
            return {
                config:config,
                query:query
            }
        },
        exec: function (scope, next) {
            
            var connection = mysql.createConnection(scope.config);
            var query=scope.query;
            var param={};
            
            if (query==null)
                query=scope.$$input;
            else
                param=scope.$$input;
            
            
            
            var result=[];
            async.series([
               function(cb){
                   connection.connect();
                   cb();
               },
               function(cb){
                    connection.query(query,param,function(err,rows,field){
                        if (err) {
                            throw err;
                        }
                        
                        if (rows!=null){
                            
                            if (typeof rows == 'object'){
                                result=rows;
                            }else{
                                for(var i=0;i<rows.length;i++){
                                    result.push(rows[i]);
                                }    
                            }
                            
                            
                        }
                        cb();
                    });  
               },
               function(cb){
                   connection.end();
                   cb();
               },
               function(cb){ 
                   next(result);
                   cb();
               }
            ]);
        }
    });

    return tasks;
}
