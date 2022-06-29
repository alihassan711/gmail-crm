const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Email extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
          Email.belongsTo(models.Case, { foreignKey: "case_id" });
    }
  }
  Email.init({
    email_id: DataTypes.STRING,
    case_id: DataTypes.INTEGER,
    sender_email: DataTypes.STRING,
    reciever_email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Email',
  });
  return Email;
};