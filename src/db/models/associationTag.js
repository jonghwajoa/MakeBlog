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

  AssociationTag.createIfnotExistByCompositeKey = (post_no, tag_no) => {
    return AssociationTag.findOrCreate({
      where: {
        post_no,
        tag_no,
      },
    });
  };

  return AssociationTag;
};
