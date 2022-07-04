import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';

import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, fetchPostsByTags, fetchTags } from '../redux/slices/posts';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';

export const Home = ({ tabActive, type = 'posts' }) => {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.auth.data);
  const { posts, tags } = useSelector(state => state.posts);
  const isPostsLoading = posts.status === 'loading'
  const isTagsLoading = tags.status === 'loading'
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const location = pathname.split("/").at(-1) || 'new';
  React.useEffect(() => {
    if (type === 'posts') {
      dispatch(fetchPosts(location));
    }
    if (type === 'tags') {
      dispatch(fetchPostsByTags(location));
    }
    dispatch(fetchTags());
  }, [location, type]);

  return (
    <>
      {type === "posts" && (
        <Tabs
          style={{ marginBottom: 15 }}
          value={tabActive}
          aria-label="basic tabs example"
        >
          <Tab onClick={() => navigate("/new")} label="Новые"></Tab>
          <Tab onClick={() => navigate("/popular")} label="Популярные" />
        </Tabs>
      )}
      {type === "tags" && (
        <Typography variant="h4" gutterBottom component="div">
          {`#${location}`}
        </Typography>
      )}
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                id={obj._id}
                title={obj.title}
                imageUrl={
                  obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ""
                }
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={3}
                tags={obj.tags}
                isEditable={userData?._id === obj.user._id}
              />
            )
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: "Вася Пупкин",
                  avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
                },
                text: "Это тестовый комментарий",
              },
              {
                user: {
                  fullName: "Иван Иванов",
                  avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
                },
                text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
