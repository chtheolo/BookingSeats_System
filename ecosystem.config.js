module.exports = {
    apps : [{
      name: "agroNIT backend production",
      script: "./server.js",
      env: {
      //   PORT: 4043,
        NODE_ENV: "development",
      },
      env_production: {
      //   PORT: 4001,
        NODE_ENV: "production",
      },
      env_production_insecure: {
      //   PORT: 4041,
        NODE_ENV: "production_insecure",
      },
      env_development_insecure: {
      //   PORT: 4041,
        NODE_ENV: "development_insecure",
      }
    }]
  }