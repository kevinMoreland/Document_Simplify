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
function isAcceptedTag(character)
{
    //accept div, p, title, a, strong, h#
    //also work depeding on what layer you are in.
    //only let a <a> tag display if it is within the body text ex in layer 2.may want to find if there is a pattern of div class names that are ads so i don't include them
    //only looking at the first three characters.
    //a, strong, span, title, p, h#
    var acceptedTags = ["a", "str", "spa", "tit", "p", "h"];
    var index;
    for(var i = 0; i < acceptedTags.length; i +=1)
    {
        if(character[0] == acceptedTags[i][0])
        {
            index = i;
            //found which tag this corresponds to
            break;
        }
        else if(i == acceptedTags.length-1)
        {
            return false;
        }
    }
    for(var j = 1; j < acceptedTags[index].length && j < 3; j+=1)
    {
        if(character[j] != acceptedTags[index][j])
        {
            return false;
        }
    }
    return true;
}
function parseHTML(html)
{
    var inPotentialTag = 1;
    var startPotTag = 0;
    var notInPotTag = -1;

    var output = "";
    var readingStage = notInPotTag;
    var printTrue = 0;
    var acceptedTags = "dpta";
    for(var i = 0; i < html.length; i +=1)
    {
        if(html[i] == '<')
        {
            //the start of a potential tag
            readingStage = startPotTag;
            //stop printing if hit this at end
            printTrue = 0;
        }
        else if(readingStage == startPotTag)
        {
            //check second character
            if(i+2 < html.length && isAcceptedTag(html[i] + html[i+1] + html[i+2]))
            {
                readingStage = inPotentialTag;
            }
            else
            {
                readingStage = notInPotTag;
            }
        }
        else if(readingStage == inPotentialTag)
        {

            //if inside a potential tag,
            if(html[i]=='>')
            {
                //reached end of potential tag, may begin printing
                printTrue = 1;
                output += "\n";
                readingStage = notInPotTag;
            }
        }
        else if(printTrue == 1)
        {

            output += html[i];
        }
    }
    return output;
}
chrome.runtime.sendMessage({
    action: "getSource",
    source: DOMtoString(document)
});