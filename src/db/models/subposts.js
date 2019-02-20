module.exports = (sequelize, DataTypes) => {
  const SubPosts = sequelize.define(
    'SubPosts',
    {
      no: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
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
      sub_no: {
        type: DataTypes.INTEGER.UNSIGNED,
      },
    },
    {
      freezeTableName: true,
      tableName: 'tbl_subposts',
      underscored: true,
      timestamps: true,
      paranoid: true,
    },
  );

  SubPosts.associate = function(models) {
    SubPosts.belongsTo(models.Posts);
  };

  SubPosts.findByPostNo = id => {
    return SubPosts.findAll({
      where: {
        post_no: id,
      },
      attributes: ['title', 'sub_no'],
    });
  };

  SubPosts.createSubPost = (postNo, { title, content }, sub_no) => {
    return SubPosts.create({
      title,
      content,
      post_no: postNo,
      sub_no,
    });
  };

  SubPosts.findOneById = (postId, subId) => {
    return SubPosts.findOne({
      where: { post_no: postId, sub_no: subId },
      attributes: ['no'],
    });
  };

  SubPosts.findHotPost = () => {
    return SubPosts.findAll({
      limit: 5,
      attributes: ['sub_no', 'title', 'post_no'],
      order: [['count', 'desc']],
    });
  };

  SubPosts.findNextNo = postNo => {
    return SubPosts.max('sub_no', {
      where: {
        post_no: postNo,
      },
    });
  };

  SubPosts.findAllForSide = id => {
    return SubPosts.findAll({
      where: {
        post_no: id,
      },
      attributes: ['title', 'sub_no'],
    });
  };

  SubPosts.findDetailByCompositeId = (postId, subId) => {
    return SubPosts.findOne({
      where: { post_no: postId, sub_no: subId },
      attributes: [
        'no',
        'sub_no',
        'title',
        'content',
        'count',
        [SubPosts.sequelize.fn('date_format', SubPosts.sequelize.col('created_at'), '%Y-%m-%d'), 'created_at'],
      ],
    });
  };

  SubPosts.deleteByPostId = id => {
    return SubPosts.destroy({
      where: {
        post_no: id,
      },
    });
  };

  return SubPosts;
};
