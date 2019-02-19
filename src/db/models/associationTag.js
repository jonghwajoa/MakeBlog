module.exports = (sequelize, DataTypes) => {
  const AssociationTag = sequelize.define(
    'AssociationTag',
    {
      post_no: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
      },

      tag_no: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
      },
    },
    {
      freezeTableName: true,
      tableName: 'tbl_post_tag',
      underscored: true,
      timestamps: false,
    },
  );

  /* Instance Method */

  AssociationTag.prototype.getTagNo = function() {
    return this.tag_no;
  };

  /* class Method */
  AssociationTag.associate = function(models) {
    AssociationTag.belongsTo(models.Posts);
    AssociationTag.belongsTo(models.Tags);
  };

  AssociationTag.createCompositeKey = (post_no, tag_no) => {
    return AssociationTag.findOrCreate({
      where: {
        post_no,
        tag_no,
      },
    });
  };

  AssociationTag.createCompositeKeyTransaction = (post_no, tag_no, transaction) => {
    return AssociationTag.findOrCreate({
      where: {
        post_no,
        tag_no,
      },
      transaction,
    });
  };

  // 보류
  AssociationTag.findByPostNo = post_no => {
    return AssociationTag.findAll({
      where: {
        post_no,
      },
      attributes: ['tag_no'],
    });
  };

  AssociationTag.deleteByPostNo = post_no => {
    return AssociationTag.destroy({
      where: {
        post_no,
      },
    });
  };

  AssociationTag.deleteByPostNoTransaction = (post_no, transaction) => {
    return AssociationTag.destroy(
      {
        where: {
          post_no,
        },
      },
      { transaction },
    );
  };

  AssociationTag.findAllOrderLength = () => {
    return AssociationTag.findAll({
      attributes: [[sequelize.fn('COUNT', 'tag_no'), 'count']],
      include: [{ model: sequelize.models.Tags, attributes: ['name'] }],
      group: ['tag_no'],
      order: [[[sequelize.literal('count'), 'desc']]],
    });
  };

  return AssociationTag;
};
