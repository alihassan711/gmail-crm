'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Case extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    Case.hasMany(models.Email, { as: "email", foreignKey: "case_id" });

    }
  }
  Case.init({
    case_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Case',
  });
  return Case;
};