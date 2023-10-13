// @flow

console.time('lint-messages')

const fs = require('fs')
const path = require('path')

const safeLoad = require('js-yaml').safeLoad
const objectPath = require('object-path')

const issueTypes = {
  dynamicMessageWithoutPossibilitiesComment: 'warning',
  languageMessageSimilarity: 'warning',
  mismatchingComponentMessagesClass: 'error',
  undefinedComponentMessages: 'error',
  undefinedMessage: 'error',
  unneccessaryComponentMessageDefinition: 'error',
  unusedMessageDefinition: 'warning'
}
const error = []
const jsMessageCounts = {}
const languageMessageCounts = {}
const warning = []

function addIssue (type, issue) {
  const issueErrorLevel = issueTypes[type]
  if (issueErrorLevel === 'error' || process.argv.indexOf('--no-warn') === -1) {
    console[issueErrorLevel === 'warning' ? 'warn' : 'error'](
      `${issueErrorLevel.toUpperCase()}: ${issue}`
    )
  }
  if (issueErrorLevel === 'error') {
    error.push({ issue, type })
  } else {
    warning.push({ issue, type })
  }
}

const foundMessages = {}
const messages = {}

// read in language data
fs.readdirSync('i18n').forEach(langFile => {
  // $FlowFixMe not sure why there's an error here
  messages[langFile] = safeLoad(fs.readFileSync(path.join('i18n', langFile)))
})

/**
 * Recursively explore a directory looking for .js files to analyze
 */
function exploreDir (filePath) {
  fs.readdirSync(filePath).forEach(fileOrFolder => {
    const fileOrFolderPath = path.join(filePath, fileOrFolder)
    const stats = fs.statSync(fileOrFolderPath)
    if (stats.isDirectory()) {
      exploreDir(fileOrFolderPath)
    } else if (fileOrFolder.indexOf('.js') > -1) {
      analyzeFile(fileOrFolderPath)
    }
  })
}

/**
 * Analyze a .js file to keep track of messages found within .js code
 */
function analyzeFile (filePath) {
  const classRegex = /class (\w*) extends (Pure)?Component/gm
  const componentMessagesRegex = /^\s*messages = getComponentMessages\('(\w*)'\)/gm
  const contents = fs.readFileSync(filePath, { encoding: 'utf8' }).split('\n')
  let curClass
  let lineIdx = 0
  let foundComponetMessagesDefinition = false
  let messagesInCurClass = 0

  function checkForUnneccessaryComponentMessagesDefinition () {
    if (curClass && foundComponetMessagesDefinition && messagesInCurClass === 0) {
      addIssue(
        'unneccessaryComponentMessageDefinition',
        `Unneccessary component definition found in class '${curClass}' in file '${filePath}'`
      )
    }
  }

  contents.forEach(line => {
    lineIdx++

    // find a MessageComponent class
    const classMatch = classRegex.exec(line)
    if (classMatch) {
      checkForUnneccessaryComponentMessagesDefinition()
      curClass = classMatch[1]
      foundComponetMessagesDefinition = false
      messagesInCurClass = 0
      return
    }

    // look for a message
    if (curClass) {
      // find initialization of component messages
      const componentMessagesDefinitionMatch = componentMessagesRegex.exec(line)
      if (componentMessagesDefinitionMatch) {
        const componentMessagesClassname = componentMessagesDefinitionMatch[1]
        if (componentMessagesClassname !== curClass) {
          addIssue(
            'mismatchingComponentMessagesClass',
            `The component messages definition of '${componentMessagesClassname}' differs from the component name of ${curClass} in file ${filePath}`
          )
        }
        foundComponetMessagesDefinition = true
      }

      const messageIndex = line.indexOf('this.messages(')
      if (messageIndex > -1) {
        // found a message
        messagesInCurClass++

        // make sure component messages have been defined
        if (!foundComponetMessagesDefinition) {
          addIssue(
            'undefinedComponentMessages',
            `Encountered a message in component '${curClass}' in file '${filePath}' before finding the component message definition`
          )
        }

        // determine what the message path is
        // if the first character is not ', it's a variable or a template string
        const firstChar = line[messageIndex + 14]
        if (firstChar === "'") {
          // found a parseable message, add some stats
          jsMessageCounts[filePath] = (jsMessageCounts[filePath] || 0) + 1

          // argument sent to this.messages is a static string, get the string
          // and add an entry to the foundMessages object
          const message = line.substring(
            messageIndex + 15,
            line.indexOf(firstChar, messageIndex + 16)
          )
          objectPath.set(foundMessages, `${curClass}.${message}`, true)
        } else {
          // argument sent to this.messages is a variable or string template
          // TODO: analyze some kind of comment outlining message possibilities
          addIssue(
            'dynamicMessageWithoutPossibilitiesComment',
            `unable to determine message object path from variable or template string in file '${filePath}' on line ${lineIdx}`
          )
        }
      }
    }
  })

  checkForUnneccessaryComponentMessagesDefinition()
}

// iterate through js files and find all places where messages are used
exploreDir('lib')

const seenDefinedMessages = {}

// explore message definitions in all languages and do two things for each
// message value:
// 1. Check if the messages defined in the language files are used in any js
//    file.  If not, they do not need to exist in the language file.
// 2. Analyze message similarity across language files. Each language should
//    probably differ slightly from the other, but maybe not when a message in
//    one language file is the same as a message in another language file,
//    create a warning issue
Object.keys(messages).forEach(langFile => {
  const langMessages = messages[langFile]
  languageMessageCounts[langFile] = 0

  // this function is used to recursively explore the next level of an object in
  // a message object
  function analyzeMessageObject (obj, pathSoFar) {
    // iterate through all keys of the current object
    Object.keys(obj).forEach(key => {
      const nextPath = pathSoFar ? `${pathSoFar}.${key}` : key
      if (typeof obj[key] === 'string') {
        // the value of this key is a string, therefore, the key/value pair is a
        // message
        languageMessageCounts[langFile]++

        // check if this message was found in any js files in the project
        if (!objectPath.get(foundMessages, nextPath)) {
          // FIXME: make this cause an error once variables and
          // template strings are accounted for
          addIssue(
            'unusedMessageDefinition',
            `message ${nextPath} in ${langFile} not found in any .js files`
          )
        }

        // don't bother anlayzing the language similarity if we've already seen
        // this message in another language file
        if (seenDefinedMessages[nextPath]) return
        seenDefinedMessages[nextPath] = true

        // analyze the similarity of this message in this language file to the
        // corresponding message in other language message files
        Object.keys(messages)
          .filter(compareLangFile => compareLangFile !== langFile)
          .forEach(compareLangFile => {
            const compareLangMessages = messages[compareLangFile]['components']
            if (obj[key] === objectPath.get(compareLangMessages, nextPath)) {
              // FIXME: make this cause an error once we decide to have actual
              // translations for all languages
              addIssue(
                'languageMessageSimilarity',
                `message ${nextPath} in ${langFile} is the same as the message in ${compareLangFile}`
              )
            }
          })
      } else {
        analyzeMessageObject(obj[key], nextPath)
      }
    })
  }

  analyzeMessageObject(langMessages['components'])
})

// Recursively analyze a foundMessages Object to determine which messages that
// were found in the .js files have a corresponding entry in each language file
function analyzeFoundObject (obj, pathSoFar) {
  Object.keys(obj).forEach(key => {
    const nextPath = pathSoFar ? `${pathSoFar}.${key}` : key
    if (typeof obj[key] === 'boolean') {
      // the value of this key is a boolean, therefore, the key/value pair
      // indicates a message found in a js file
      Object.keys(messages).forEach(langFile => {
        const langMessages = messages[langFile]['components']
        if (!objectPath.get(langMessages, nextPath)) {
          addIssue(
            'undefinedMessage',
            `message ${nextPath} not defined in language file ${langFile}`
          )
        }
      })
    } else {
      analyzeFoundObject(obj[key], nextPath)
    }
  })
}

analyzeFoundObject(foundMessages)

// print results
console.log('')
console.timeEnd('lint-messages')
console.log(`\nFound ${Object.keys(languageMessageCounts).length} message files.`)
Object.keys(languageMessageCounts).forEach(langFile => {
  console.log(` - ${langFile}: ${languageMessageCounts[langFile]} messages`)
})
console.log(`\nFound ${
  Object.keys(jsMessageCounts).length
} js files with ${
  Object.keys(jsMessageCounts).reduce((accumulator, currentValue) => {
    return accumulator + jsMessageCounts[currentValue]
  }, 0)
} total messages.`)
console.log(`\nLinting produced ${error.length} errors and ${warning.length} warnings.`)
Object.keys(issueTypes).forEach(issueType => {
  console.log(` - ${issueType}: ${error.reduce((accumulator, currentValue) => {
    return accumulator + (currentValue.type === issueType ? 1 : 0)
  }, 0)} errors and ${warning.reduce((accumulator, currentValue) => {
    return accumulator + (currentValue.type === issueType ? 1 : 0)
  }, 0)} warnings`)
})

if (error.length > 0) {
  process.exit(2)
}
