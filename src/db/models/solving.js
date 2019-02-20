module.exports = (sequelize, DataTypes) => {
  const Solving = sequelize.define(
    'Solving',
    {
      problemNum: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
      },
      title: { type: DataTypes.STRING(100), allowNull: false },
      content: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
      },
      count: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING(300),
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      tableName: 'tbl_Solving',
      underscored: true,
      timestamps: true,
      paranoid: true,
    },
  );

  Solving.associate = function(models) {
    Solving.belongsTo(models.CategoryCote);
    Solving.belongsTo(models.Users, { foreignKey: 'writer' });
  };

  Solving.findByCategoryId = no => {
    return Solving.findOne({
      where: {
        category_cote_no: no,
      },
    });
  };

  Solving.createByFullColumns = ({ title, url, problemNum, content, category }, writer) => {
    return Solving.create({
      problemNum,
      title,
      url,
      content,
      category_cote_no: category,
      writer,
    });
  };

  Solving.findDetialById = id => {
    return Solving.findById(id, {
      attributes: [
        'problemNum',
        'title',
        'content',
        'count',
        'url',
        'category_cote_no',
        [Solving.sequelize.fn('date_format', Solving.sequelize.col('created_at'), '%Y-%m-%d'), 'created_at'],
      ],
    });
  };

  return Solving;
};
