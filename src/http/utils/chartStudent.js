
module.exports = (any,arr)=>{
    const userCountByMonth = any.reduce(function(acc, user) {
        const createdAt = new Date(user.dataValues.createdAt);
        if(createdAt.getFullYear()===+process.env.YEAR){
        const month = createdAt.getMonth() + 1;
   
        
            
        acc[month] = (acc[month] || 0) + 1;
        arr[month-1]=acc[month]
        
    }
        return acc ;
      }, {});
      
}