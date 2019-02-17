module.exports = (sequelize, DataTypes) => {
  const AssociationTag = sequelize.define(
    'AssociationTag',
    {},
    {
      freezeTableName: true,
      tableName: 'tbl_post_tag',
      underscored: true,
      timestamps: false,
    },
  );

  AssociationTag.associate = function(models) {};
  return AssociationTag;
};
