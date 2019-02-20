module.exports = (sequelize, DataTypes) => {
  const CategoryCote = sequelize.define(
    'CategoryCote',
    {
      no: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      order: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      tableName: 'tbl_category_cote',
      underscored: true,
      timestamps: false,
    },
  );

  CategoryCote.associate = function(models) {
    CategoryCote.hasMany(models.Solving);
  };

  CategoryCote.findAllList = () => {
    return CategoryCote.findAll({
      order: [['order']],
      include: [
        {
          model: sequelize.models.Solving,
          attributes: ['problemNum'],
        },
      ],
    });
  };

  CategoryCote.findByName = name => {
    return CategoryCote.findOne({
      where: {
        title: name,
      },
    });
  };

  CategoryCote.createByTitle = (title, order) => {
    return CategoryCote.create({
      title,
      order,
    });
  };

  CategoryCote.findNextOrder = () => {
    return CategoryCote.max('order');
  };

  return CategoryCote;
};
