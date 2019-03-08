function DOMtoString(document_root) {
    var html = '';
    var node = document_root.firstChild;
    while (node) {
        if(node.nodeType == Node.ELEMENT_NODE) {
            html = parseHTML(node.outerHTML);
        }
        node = node.nextSibling;
    }
    return html;
}
function isAcceptedTag(tag)
{
    var acceptedTags = ["a", "strong", "i", "span", "div","p", "h1", "h2", "h3", "h4", "h5", "h6"];
    if(acceptedTags.includes(tag))
    {
        return true;
    }
    return false;
    
}
function getTag(html, i)
{
    //html[i] should be at first character after "<"

    //will return array with array[0] = tag, array[1] = i bc need to update i

    //output var contains: tag, new i value, T/F is end tag
    var output = ["", i, false];
    var endOfTagName = false;
    if(html[i] == '/')
    {
        output[2] = true;
    }
    //tag name will end if we hit a " " [ex <a href= "">] or ">" [ex <h1>]
    while(html[i] != '>')
    {
        if(html[i] == ' ')
        {
            endOfTagName = true;
            //maybe check rest of info to see if it contains flags for being ads?
        }
        if(!endOfTagName && html[i] != '/')
        {
            output[0] += html[i];
        }
        i+=1;
    }

    output[1] = i;
    return output;
}

function parseHTML(html)
{
    var output = "";
    var outputBuffer = "";
    var printingOut = false;
    var endTag = false;
    var curTag = "";
    var poppedTag = "";
    var tagStack = [];

    for(var i = 0; i < html.length; i +=1)
    {
        if(html[i] == '<')
        {
            //move past the '<' character to first char in tag
            i+=1;
            var tagInfo = getTag(html, i);
            i = tagInfo[1];
            endTag = tagInfo[2];
            //push/ pop from stack even if not accepted tag


            if(isAcceptedTag(tagInfo[0]))
            {
                if(!endTag)
                {
                    tagStack.push(tagInfo[0]);
                    outputBuffer += ("<" + tagInfo[0] + ">");
                }
                else
                {
                    poppedTag = tagStack.pop();
                    if(tagStack.length == 0)
                    {
                        //We have completed reading through a tag layer
                        //add to output even if empty, clear buffer
                        output += outputBuffer;

                        outputBuffer = "";
                        printingOut = false;
                    }
                    outputBuffer += ("</" + poppedTag + ">");
                }
                printingOut = true;
            }
            else
            {
                //can't print after this tag, not a proper tag
                printingOut = false;
            }
        }
        else if(printingOut)
        {
            //if not in tag and this is printable text, print
            outputBuffer += html[i];
        }

    }
    return output;
}
chrome.runtime.sendMessage({
    action: "getSource",
    source: DOMtoString(document)
});
