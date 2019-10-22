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
    var acceptedTags = ["a", "cite","strong", "i", "span", "body","div","p", "h1", "h2", "h3", "h4", "h5", "h6", "section", "header"];
    if(acceptedTags.includes(tag))
    {
        return true;
    }
    console.log(tag);
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
function isAd(text)
{
    //TODO: work on code that detects key words to see if something is an ad
    var possibleAds = ["paid content", "advertisement", "sponsored by", "content by"];
    
    //usually, it seems like the above will be included in a set of 4 or less words above an ad
    if(text.split().length <= 4)
    {
        for(var i = 0; i < text.length; i++)
        {
            if(text.toLowerCase().includes(possibleAds[i]))
            {
                return true;
            }
        }
    }
    return false;
}
function parseHTML(html)
{
    //TODO alot of junk is printed when there is a video on the page

    //I add to a buffer, and if the text turns out to be an ad, I clear it.
    //if not, i add the buffer to the actual output
    var output = "";
    var outputBuffer = "";
    //used for checking if text is an ad
    var outputRaw = "";

    var printingOut = false;
    var endTag = false;

    //if I detect I'm in an ad, I must wait until I've popped all tags off the stack before I can print again
    var insideAd = false;
    //this is used for determining if I'm still within the tag of an ad
    var adLayer = 0;

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

            //push/ pop from stack if accepted tag
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
                    if(tagStack.length == adLayer)
                    {
                        //if I was in an ad container, I no longer am
                        insideAd = false;
                    }
                    if(tagStack.length == 0)
                    {
                        //We have completed reading through a tag layer
                        //add to output even if empty, clear buffer
                        output += outputBuffer;
                        outputBuffer = "";
                        printingOut = false;
                    }
                    outputBuffer += ("</" + poppedTag + ">");
                    /*
                    if(isAd(outputRaw))
                    {
                        //add everything previously in buffer exept for the ad and what follows it in the tag hierarchy
                        //this makes sure I keep the ending tag to the ad but not the actual text. This ensures that the tag we first made has an end
                        output += (outputBuffer.substring(0, outputBuffer.length - outputRaw.length - poppedTag.length - 3) + (outputBuffer.substring(outputBuffer.length -poppedTag.length - 3)));
                        outputBuffer = "";
                        adLayer = tagStack.length;
                        //everything else in this stack is an ad probably
                        if(tagStack.length > 0)
                        {
                            insideAd = true;
                        }   
                    }*/

                }
                //outputRaw just needs to see whats in this current tag
                outputRaw = "";
                printingOut = true;
            }
            else
            {
                //can't print after this tag, not a proper tag
                printingOut = false;
            }
        }
        else if(printingOut && !insideAd)
        {
            //if not in tag and this is printable text, print
            outputBuffer += html[i];
            outputRaw += html[i];
        }

    }
    return output;
}
chrome.runtime.sendMessage({
    action: "getSource",
    source: DOMtoString(document)
});
