import React from 'react'
import { connect } from 'redux-bundler-react'
import { map } from 'lodash'

function BucketList (props) {

  const { doUpdateQuery,
          doMarkEndpointsResourceAsOutdated,
          doMarkMetadataResourceAsOutdated,
          doMarkTestsResourceAsOutdated,
          doMarkTestSequencesResourceAsOutdated,
          doMarkTestTagsResourceAsOutdated,
          doMarkUseragentsResourceAsOutdated,
          config,
          bucketJobPaths,
          activeBucketJob
        } = props
  if (config == null) return null
  return (
      <div id='bucket-list' className='mb3 pa1'>
      <h2 className='mb0 f5'>Select a Bucket</h2>
      <p className='i f6 mt0'>Jobs are coming from {config.source}</p>
      <select className="list flex flex-wrap pl0 w-100 f7" onChange={(e) => handleClick(e.target.value)}>
      {map(bucketJobPaths, (fullPath, bucketJob, bucketJobPath)=> {
        let bucket = bucketJob.split('/')[0]
        if (bucketJob === activeBucketJob) {
          return(
              <option className='pr2 pb2 f7' key={fullPath} value={fullPath} selected>
              {bucket}
            </option>
          )
        } else{
          return(
              <option className='pr2 pb2 f7' key={fullPath} value={fullPath}>
              {bucket}
            </option>
          )
        }
      })}
    </select>
      </div>
  )

  function handleClick (path) {
    let bucket = path;
    doMarkEndpointsResourceAsOutdated()
    doMarkTestsResourceAsOutdated()
    doMarkTestSequencesResourceAsOutdated()
    doMarkTestTagsResourceAsOutdated()
    doMarkMetadataResourceAsOutdated()
    doMarkUseragentsResourceAsOutdated()
    doUpdateQuery({bucket: bucket})
  }
}

export default connect(
  'doUpdateQuery',
  'doMarkEndpointsResourceAsOutdated',
  'doMarkTestsResourceAsOutdated',
  'doMarkMetadataResourceAsOutdated',
  'doMarkTestSequencesResourceAsOutdated',
  'doMarkTestTagsResourceAsOutdated',
  'doMarkUseragentsResourceAsOutdated',
  'selectActiveBucketJob',
  'selectBucketJobPaths',
  'selectConfig',
  BucketList
)
