
module.exports = (any,arr)=>{
    const classCountByMonth = any.reduce(function(acc, cls) {
        const createdAt = new Date(cls.dataValues.createdAt);
        if(createdAt.getFullYear()===+process.env.YEAR){
        const month = createdAt.getMonth() + 1;
   
        
            
        acc[month] = (acc[month] || 0) + 1;
        arr[month-1]=acc[month]
        
    }
        return acc ;
      }, {});
      
}