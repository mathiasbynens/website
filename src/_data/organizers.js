const groq = require('groq')
const BlocksToMarkdown = require('@sanity/block-content-to-markdown')
const client = require('../utils/sanityClient.js')
const serializers = require('../utils/serializers')
const overlayDrafts = require('../utils/overlayDrafts')
const urlFor = require('../utils/imageUrl.js')

// TODO: delete?
const hasToken = !!client.config().token

function generateOrganizer (person) {
  return {
    ...person,
    bio: BlocksToMarkdown(person.bio, { serializers, ...client.config() }),
    headshotSrc: urlFor(person.image).width(300).height(300).url(),
  }
}

async function getOrganizers () {
  const filter = groq`*[_type == "person" && organizer] `
  const docs = await client.fetch(filter).catch(err => console.error(err))
  const organizers = docs.map(generateOrganizer)
  const reducedOrganizers = overlayDrafts(hasToken, organizers)
  return reducedOrganizers
}

module.exports = getOrganizers
