import React, { useState, useEffect } from 'react';
import { Layout, Dropdown, Box, EmptyState, Pagination, DatePicker } from 'vtex.styleguide'
import styles from './index.css';
import nissan_placeholder_image from "../assets/blog-placeholder-image.jpg";
import { makeAPICall } from "./Utils/httpCall";
import { useCssHandles } from 'vtex.css-handles';

const CSS_HANDLES = [
  'noBlogsFoundContainer',
  'blogListingWrapper',
  'blogs',
  'imageWrapper',
  'contentWrappper',
  'date',
  'author',
  'category',
  'blogTitle',
  'shortDescription',
  'blogPageContainer',
  'blogsListingContainer',
  'blogsListingHeader'
];

const category = [
  { label: 'All Categories', value: "all" },
  { label: 'ELECTRIC', value: 'ELECTRIC' },
  { label: 'LIFESTYLE', value: 'LIFESTYLE' },
  { label: 'TECHNOLOGY', value: 'TECHNOLOGY' },
  { label: 'Brakes', value: 'Brakes' },
];

let listData;
let mainImage = nissan_placeholder_image;
let filterData;

const BlogListing = (props) => {
  const handles = useCssHandles(CSS_HANDLES);
  const accountName = props.accountName;
  const entityIdAcronym = props.entityIdAcronym;
  const schemaName = props.schemaName;
  const storeURL = "https://"+ accountName +".vtexcommercestable.com.br"
  let dateFilter = "";
  let blogsListUrl = ""

  const [selected, setSelected] = useState(null);
  const [selectDate, setDate] = useState();
  const handleDateChange = (date) => {
      setDate(date);
  }

  const [data, setData] = useState([]);
  const [blogList, setBlogList] = useState([]);

  useEffect(() => {
    console.log(selectDate);
    if (selectDate) {
        let newDate = new Date(selectDate);
        let year = newDate.getFullYear();
        let month = ("0" + (newDate.getMonth() + 1)).slice(-2);
        let day = ("0" + newDate.getDate()).slice(-2);
        let selectedDate = year + "-" + month + "-" + day;
        dateFilter= "&_where=createdIn%3D" + selectedDate;
    }
    blogsListUrl = "/api/dataentities/"+ entityIdAcronym + "/search?_fields=_all"+ dateFilter +"&_schema="+ schemaName +"&_sort=createdIn%20DESC"
    const getBlogs = async () => {
        const responseData = await makeAPICall(blogsListUrl, "GET", "0-100");
        setData(responseData);
    };
    getBlogs();
  }, [selectDate]);

  if (selected === null || selected === "all") {
      filterData = data;
  } else {
      filterData = selected && data.filter(ele => ele.category == selected);
  }

  const showNoBlogs = () => {
      return (
          <div className={handles.noBlogsFoundContainer}>
                <Box fit="fill" >
                    <EmptyState title={"No Blogs Found"}>
                        <p>{"There are no blogs available matching our filter selection."}</p>
                    </EmptyState>
                </Box>
          </div>
      )
  }

  const showBlogsList = () => {
      return (
          <div className={handles.blogListingWrapper}>
          { filterData &&
              filterData.map((blogs) => {
                  let dateString = (blogs.createdIn ? blogs.createdIn : blogs.updatedIn).split('T')[0];
                  let date = new Date(dateString);
                  let formattedDate = date.toLocaleString('en-US', {
                      weekday: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      month: 'long',
                  })

                  if (blogs.mainImage) {
                      mainImage = blogs.mainImage
                  }
                  return (
                      <div className={handles.blogs} key={blogs.id}>
                          <div className={handles.imageWrapper}>
                              <img src={mainImage} alt={blogs.displayName + " Banner Image"} className={styles.blogImage} />
                          </div>
                          <div className={handles.contentWrappper} >
                              <p className={handles.date}>{formattedDate}</p>
                              <p className={handles.author}> {"by " + blogs.author}</p>
                              <p>{"# "}<span className={handles.category}>{blogs.category}</span></p>
                              <h3 className={handles.blogTitle}>
                                  {blogs.displayName}
                              </h3>
                              <p className={handles.shortDescription}>
                                  {blogs.shortDescription}
                              </p>
                              {blogs.documentLink &&
                              <a href={blogs.documentLink} title="Document Link" target={"_blank"} className="primary">Document Link</a>}

                          </div>
                      </div>
                  )
              })
          }
          </div>
      )
  };
  if (selected === null || filterData.length !== 0) {
      listData = showBlogsList();
  }

  if (selected !== null && filterData.length === 0) {
      listData = showNoBlogs();
  }

  return (
    <div className={handles.blogPageContainer}>
      <Layout fullWidth={true}>
          <div className={handles.blogsListingContainer}>
              <div className={handles.blogsListingHeader +" flex"}>
                  <h2>{"Blog Listing"}</h2>
                  <div className={styles.filterWrapper + " flex justify-end"}>
                      <div className="pr2">{"Filter By: "}</div>
                      {/* <DateFilter /> */}
                      <div className="">
                          <DatePicker
                          size="large"
                          placeholder="Select Date"
                          value={selectDate}
                          onChange={date => handleDateChange(date)}
                          locale="en-US"
                          maxDate= {new Date()}
                          />
                      </div>
                      <div className={styles.dropdownWrapper}>
                          <Dropdown
                              placeholder="Category"
                              size="large"
                              options={category}
                              value={selected}
                              onChange={(_, value) => setSelected(value)}
                          />
                      </div>
                  </div>
              </div>
              {listData}
              {/* <div className="ma5">
                  <Pagination
                      rowsOptions={[5, 10, 15, 20]}
                      currentItemFrom={1}
                      currentItemTo={5}
                      textOf="of"
                      textShowRows="Items per page:"
                      totalItems={data.length}
                  />
              </div> */}
          </div>
      </Layout>
    </div>
  )
}
export default BlogListing;
